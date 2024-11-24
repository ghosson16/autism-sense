import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import LoginForm from "../components/Authentication/LoginForm";
import { login } from "../services/authService";
import { BrowserRouter } from "react-router-dom";
jest.mock("../services/authService");

const MockLoginForm = () => (
  <BrowserRouter>
    <LoginForm />
  </BrowserRouter>
);

describe("LoginForm Component", () => {
  beforeEach(() => {
    render(<MockLoginForm />);
  });

  test("should display an error for an invalid email format", async () => {
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: /login/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalidemail" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Please enter a valid email address./i)).toBeInTheDocument();
  });

  test("should display an error for an invalid password", async () => {
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "short" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Invalid password. Please try again./i)).toBeInTheDocument();
  });

  test("should call login function with correct data when form is valid", async () => {
    login.mockResolvedValueOnce({ message: "Login successful", user: { id: 1 } });

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password1" } });
      fireEvent.click(submitButton);
    });

    expect(login).toHaveBeenCalledWith("user@example.com", "Password1");
  });


  test("should display an error message if login fails", async () => {
    login.mockRejectedValueOnce(new Error("Login failed"));

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password1" } });
      fireEvent.click(submitButton);
    });

    expect(await screen.findByText(/An error occurred during login. Please try again./i)).toBeInTheDocument();
  });

  test("should display an error message for invalid email or password", async () => {
    login.mockResolvedValueOnce({ message: "Invalid email or password" });

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "WrongPassword1" } });
      fireEvent.click(submitButton);
    });

    expect(await screen.findByText(/Invalid email or password/i)).toBeInTheDocument();
  });

});
