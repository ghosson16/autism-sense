import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ChildProfilePage from '../components/Profile/ProfilePage';
import { deleteChildAccount, updateChildData } from '../services/childService';
import { BrowserRouter as Router } from 'react-router-dom';
jest.mock('../services/childService');

const mockChild = {
  firstName: 'John',
  lastName: 'Doe',
  dob: '2010-05-15',
  email: 'john.doe@example.com',
  photo: ''
};

const mockOnSave = jest.fn();
const mockOnClose = jest.fn();

describe('ChildProfilePage Component', () => {
  beforeAll(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <Router>
        <ChildProfilePage
          child={mockChild}
          childId="123"
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      </Router>
    );
  });

  test('should show error for invalid first name', async () => {
    fireEvent.click(screen.getByText('Edit Profile'));

    const firstNameInput = screen.getByPlaceholderText(/First Name/i);
    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: 'A' } });
    });

    expect(screen.getByText(/First name must contain at least two alphabetic characters./i)).toBeInTheDocument();
  });

  test('should show error for invalid last name', async () => {
    fireEvent.click(screen.getByText('Edit Profile'));

    const lastNameInput = screen.getByPlaceholderText(/Last Name/i);
    await act(async () => {
      fireEvent.change(lastNameInput, { target: { value: 'B' } });
    });

    expect(screen.getByText(/Last name must contain at least two alphabetic characters./i)).toBeInTheDocument();
  });

  test('should show error for invalid email format', async () => {
    fireEvent.click(screen.getByText('Edit Profile'));

    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    });

    expect(screen.getByText(/Please enter a valid email address in the format: example@example.com/i)).toBeInTheDocument();
  });

  test('should save changes and show success message', async () => {
    updateChildData.mockResolvedValueOnce({ ...mockChild, firstName: 'Jane' });

    fireEvent.click(screen.getByText('Edit Profile'));

    const firstNameInput = screen.getByPlaceholderText(/First Name/i);
    await act(async () => {
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    });

    const saveButton = screen.getByText(/Save Changes/i);
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(updateChildData).toHaveBeenCalledWith('123', expect.objectContaining({ firstName: 'Jane' }));
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({ firstName: 'Jane' }));
    expect(window.alert).toHaveBeenCalledWith('Changes saved successfully.');
  });

  test('should show error if saving changes fails', async () => {
    updateChildData.mockRejectedValueOnce(new Error('Failed to save'));

    fireEvent.click(screen.getByText('Edit Profile'));

    const saveButton = screen.getByText(/Save Changes/i);
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(screen.getByText(/Failed to save changes. Please check your network connection and try again./i)).toBeInTheDocument();
  });

  test('should delete account after confirmation', async () => {
    deleteChildAccount.mockResolvedValueOnce();

    const deleteButton = screen.getByText(/Delete Account/i);
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this account? This action cannot be undone.');
    expect(deleteChildAccount).toHaveBeenCalledWith('123');
    expect(window.alert).toHaveBeenCalledWith('Account deleted successfully.');
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should show error if deleting account fails', async () => {
    deleteChildAccount.mockRejectedValueOnce(new Error('Failed to delete'));

    const deleteButton = screen.getByText(/Delete Account/i);
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(screen.getByText(/Failed to delete the account. Please try again later./i)).toBeInTheDocument();
  });
});
