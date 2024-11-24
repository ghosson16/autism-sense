import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SignUpForm from "../components/Authentication/SignUpForm";
import { signUp } from "../services/authService";
import { BrowserRouter } from "react-router-dom";
jest.mock("../services/authService");

const MockSignUpForm = () => (
  <BrowserRouter>
    <SignUpForm />
  </BrowserRouter>
);

describe("SignUpForm Component", () => {
  beforeEach(() => {
    render(<MockSignUpForm />);
  });

  test("should display errors for invalid first name and last name", async () => {
    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: "A" } });
      fireEvent.change(lastNameInput, { target: { value: "B" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/First name should be at least two letters long./i)).toBeInTheDocument();
    expect(screen.getByText(/Last name should be at least two letters long./i)).toBeInTheDocument();
  });

  test("should display an error if email is invalid", async () => {
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalidemail" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Please enter a valid email address./i)).toBeInTheDocument();
  });

  test("should display an error if password is invalid", async () => {
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "pass" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Password must be at least 8 characters long and contain both letters and numbers./i)).toBeInTheDocument();
  });

  test("should display an error if passwords do not match", async () => {
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "password1" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "password2" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Passwords do not match./i)).toBeInTheDocument();
  });

  test("should call signUp function with correct data when form is valid", async () => {
    signUp.mockResolvedValueOnce({ message: "Child data saved successfully", user: { id: 1 } });

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const daySelect = screen.getByLabelText(/Day/i);
    const monthSelect = screen.getByLabelText(/Month/i);
    const yearSelect = screen.getByLabelText(/Year/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: "John" } });
      fireEvent.change(lastNameInput, { target: { value: "Doe" } });
      fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password1" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "Password1" } });
      fireEvent.change(daySelect, { target: { value: "1" } });
      fireEvent.change(monthSelect, { target: { value: "1" } });
      fireEvent.change(yearSelect, { target: { value: "2000" } });
      fireEvent.click(submitButton);
    });

    expect(signUp).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      dob: "2000-01-01",
      email: "john.doe@example.com",
      password: "Password1",
      photo: null,
    });
  });

  test("should display success message after successful sign-up", async () => {
    signUp.mockResolvedValueOnce({ message: "Child data saved successfully", user: { id: 1 } });

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const daySelect = screen.getByLabelText(/Day/i);
    const monthSelect = screen.getByLabelText(/Month/i);
    const yearSelect = screen.getByLabelText(/Year/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: "John" } });
      fireEvent.change(lastNameInput, { target: { value: "Doe" } });
      fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password1" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "Password1" } });
      fireEvent.change(daySelect, { target: { value: "1" } });
      fireEvent.change(monthSelect, { target: { value: "1" } });
      fireEvent.change(yearSelect, { target: { value: "2000" } });
      fireEvent.click(submitButton);
    });

    const successMessage = await screen.findByText(/Sign-up successful! Welcome to AutismSense./i);
    expect(successMessage).toBeInTheDocument();
  });

  test("should display error message if sign-up fails", async () => {
    signUp.mockRejectedValueOnce(new Error("Sign-up failed"));

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const daySelect = screen.getByLabelText(/Day/i);
    const monthSelect = screen.getByLabelText(/Month/i);
    const yearSelect = screen.getByLabelText(/Year/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: "John" } });
      fireEvent.change(lastNameInput, { target: { value: "Doe" } });
      fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password1" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "Password1" } });
      fireEvent.change(daySelect, { target: { value: "1" } });
      fireEvent.change(monthSelect, { target: { value: "1" } });
      fireEvent.change(yearSelect, { target: { value: "2000" } });
      fireEvent.click(submitButton);
    });

    const errorMessage = await screen.findByText((content, element) => {
      return content.includes("An error occurred during sign-up") || content.includes("Sign-up failed");
    });
    expect(errorMessage).toBeInTheDocument();
  });

  test("should display error message if email already exists", async () => {
    signUp.mockRejectedValueOnce(new Error("Email already exists"));

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const daySelect = screen.getByLabelText(/Day/i);
    const monthSelect = screen.getByLabelText(/Month/i);
    const yearSelect = screen.getByLabelText(/Year/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: "John" } });
      fireEvent.change(lastNameInput, { target: { value: "Doe" } });
      fireEvent.change(emailInput, { target: { value: "existing.email@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password1" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "Password1" } });
      fireEvent.change(daySelect, { target: { value: "1" } });
      fireEvent.change(monthSelect, { target: { value: "1" } });
      fireEvent.change(yearSelect, { target: { value: "2000" } });
      fireEvent.click(submitButton);
    });

    const errorMessage = await screen.findByText(/Email already exists/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
