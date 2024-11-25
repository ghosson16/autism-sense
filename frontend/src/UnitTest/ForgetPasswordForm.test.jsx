import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ForgetPasswordForm from "../components/Authentication/ForgetPasswordForm";
import { sendResetPasswordEmail } from "../services/authService";
jest.mock("../services/authService");

describe("ForgetPasswordForm Component", () => {
  const onCancelMock = jest.fn();

  beforeEach(() => {
    render(<ForgetPasswordForm onCancel={onCancelMock} />);
  });

  test("should render form with all necessary elements", () => {
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Reset Email/i })).toBeInTheDocument();
  });

  test("should display an error for an invalid email format", async () => {
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: /Send Reset Email/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalidemail" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Please enter a valid email address./i)).toBeInTheDocument();
  });

  test("should not display an error for a valid email format", async () => {
    const emailInput = screen.getByPlaceholderText("Enter your email");

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    });

    expect(screen.queryByText(/Please enter a valid email address./i)).not.toBeInTheDocument();
  });

  test("should call sendResetPasswordEmail with correct data when form is valid", async () => {
    sendResetPasswordEmail.mockResolvedValueOnce({ message: "Password reset email sent" });

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: /Send Reset Email/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
      fireEvent.click(submitButton);
    });

    expect(sendResetPasswordEmail).toHaveBeenCalledWith("valid@example.com");
    expect(onCancelMock).toHaveBeenCalled(); // Modal should close on success
  });

  test("should display a success message after successful password reset", async () => {
    sendResetPasswordEmail.mockResolvedValueOnce({ message: "Password reset email sent" });

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: /Send Reset Email/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
      fireEvent.click(submitButton);
    });

    expect(await screen.findByText(/Check your email for a password reset link./i)).toBeInTheDocument();
  });

  test("should display server error message if sending reset email fails", async () => {
    sendResetPasswordEmail.mockRejectedValueOnce(new Error("An unexpected error occurred."));

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: /Send Reset Email/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
      fireEvent.click(submitButton);
    });

    expect(
      await screen.findByText(/An unexpected error occurred. Please try again later./i)
    ).toBeInTheDocument();
  });

  test("should show loading state when submitting the form", async () => {
    sendResetPasswordEmail.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const submitButton = screen.getByRole("button", { name: /Send Reset Email/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
      fireEvent.click(submitButton);
    });

    expect(submitButton).toHaveTextContent("Sending...");
    expect(submitButton).toBeDisabled();
  });
});
