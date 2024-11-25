import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPassword from '../components/Authentication/ResetPassword';
import { resetPassword } from '../services/authService';
jest.mock('../services/authService');

const MockResetPassword = ({ token }) => (
  <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
    <Routes>
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  </MemoryRouter>
);

describe('ResetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('should display error for weak password', async () => {
    render(<MockResetPassword token="validtoken" />);
    
    const passwordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
    const submitButton = screen.getByRole('button', { name: /Reset Password/i });

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Password must be at least 8 characters long, including an uppercase letter, a lowercase letter, and a number./i)).toBeInTheDocument();
  });

  test('should display error when passwords do not match', async () => {
    render(<MockResetPassword token="validtoken" />);
    
    const passwordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
    const submitButton = screen.getByRole('button', { name: /Reset Password/i });

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'StrongPassword1' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword1' } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/Passwords do not match. Please ensure both passwords are identical./i)).toBeInTheDocument();
  });

  test('should call resetPassword function with correct data when form is valid', async () => {
    resetPassword.mockResolvedValueOnce({ message: 'Password reset successful' });

    render(<MockResetPassword token="validtoken" />);

    const passwordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
    const submitButton = screen.getByRole('button', { name: /Reset Password/i });

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'StrongPassword1' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPassword1' } });
      fireEvent.click(submitButton);
    });

    expect(resetPassword).toHaveBeenCalledWith('validtoken', 'StrongPassword1');
    expect(await screen.findByText(/Password has been successfully reset. You can now log in with your new password./i)).toBeInTheDocument();
  });

  test('should display error message for invalid or expired token', async () => {
    resetPassword.mockRejectedValueOnce({ response: { status: 400 } });

    render(<MockResetPassword token="invalidtoken" />);

    const passwordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
    const submitButton = screen.getByRole('button', { name: /Reset Password/i });

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'StrongPassword1' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPassword1' } });
      fireEvent.click(submitButton);
    });

    expect(await screen.findByText(/Invalid or expired token. Please request a new password reset link./i)).toBeInTheDocument();
  });

  test('should display error message for unknown server error', async () => {
    resetPassword.mockRejectedValueOnce(new Error('Unknown error'));

    render(<MockResetPassword token="validtoken" />);

    const passwordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
    const submitButton = screen.getByRole('button', { name: /Reset Password/i });

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'StrongPassword1' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPassword1' } });
      fireEvent.click(submitButton);
    });

    expect(await screen.findByText(/Unable to reset password. Please try again later./i)).toBeInTheDocument();
  });

  test('should display success message after successful password reset', async () => {
    resetPassword.mockResolvedValueOnce({ message: 'Password reset successful' });

    render(<MockResetPassword token="validtoken" />);

    const passwordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
    const submitButton = screen.getByRole('button', { name: /Reset Password/i });

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'StrongPassword1' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPassword1' } });
      fireEvent.click(submitButton);
    });

    expect(await screen.findByText(/Password has been successfully reset. You can now log in with your new password./i)).toBeInTheDocument();
  });
});
