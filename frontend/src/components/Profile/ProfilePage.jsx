import React, { useState } from 'react';
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import defaultProfileImage from '../../images/default-profile.png';
import { deleteChildAccount, updateChildData } from '../../services/childService';
import '../../styles/AuthModal.css';

const ChildProfilePage = ({ child, childId, onClose, onSave }) => {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState(child?.firstName || '');
  const [lastName, setLastName] = useState(child?.lastName || '');
  const [day, setDay] = useState(new Date(child?.dob).getDate() || '');
  const [month, setMonth] = useState(new Date(child?.dob).getMonth() + 1 || '');
  const [year, setYear] = useState(new Date(child?.dob).getFullYear() || '');
  const [email, setEmail] = useState(child?.email || '');
  const [photo, setPhoto] = useState(child?.photo || defaultProfileImage);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [childDOBError, setChildDOBError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateChildDOB = (day, month, year) => {
    const today = new Date();
    const selectedDate = new Date(year, month - 1, day);
    return selectedDate <= today;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const formattedDOB = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    if (!validateChildDOB(day, month, year)) {
      setChildDOBError("Date of birth cannot be in the future.");
      return;
    } else {
      setChildDOBError('');
    }

    const updatedChildData = { firstName, lastName, dob: formattedDOB, email, photo };
  
    try {
      const response = await updateChildData(childId, updatedChildData);
      onSave(response);
      setEditMode(false);
      window.alert("Changes saved successfully.");  // Success message as alert
    } catch (error) {
      setError('Failed to save changes. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this account?');
    if (confirmDelete) {
      try {
        await deleteChildAccount(childId);
        alert('Account deleted successfully.');
        onClose();
        navigate("/");
      } catch (error) {
        setError('Failed to delete the account. Please try again.');
      }
    }
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    setFirstNameError(!/^[A-Za-z]{2,}$/.test(value) ? 'First name should be at least two letters long.' : '');
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    setLastNameError(!/^[A-Za-z]{2,}$/.test(value) ? 'Last name should be at least two letters long.' : '');
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address.' : '');
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <button className="close-button" onClick={onClose}>X</button>

        <header className="form-photo">
          <div className="photo-ring">
            <img src={photo || defaultProfileImage} alt="Profile" className="photo-img" />
            {editMode && (
              <label htmlFor="photo-input" className="photo-pencil">
                <FaPencilAlt /> Change Image
              </label>
            )}
          </div>
        </header>

        <section className="profile-details">
          {editMode ? (
            <form onSubmit={handleSaveChanges} className="form-container">
              <div className="form-photo">
                <input type="file" id="photo-input" accept="image/*" onChange={handlePhotoChange} className="photo-input" />
              </div>
              <div className="form-group">
                <input type="text" value={firstName} onChange={handleFirstNameChange} placeholder="First Name" className="input-field" />
                {firstNameError && <p>{firstNameError}</p>}
              </div>
              <div className="form-group">
                <input type="text" value={lastName} onChange={handleLastNameChange} placeholder="Last Name" className="input-field" />
                {lastNameError && <p>{lastNameError}</p>}
              </div>
              <div className="form-group dob-field-container">
                <label>Date of Birth:</label>
                <div style={{ display: "flex", gap: "5px" }}>
                  <select value={day} onChange={(e) => setDay(e.target.value)} required>
                    <option value="">Day</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>

                  <select value={month} onChange={(e) => setMonth(e.target.value)} required>
                    <option value="">Month</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1} disabled={year === currentYear && i + 1 > currentMonth}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <select value={year} onChange={(e) => setYear(e.target.value)} required>
                    <option value="">Year</option>
                    {[...Array(100)].map((_, i) => {
                      const yearOption = currentYear - i;
                      return (
                        <option key={yearOption} value={yearOption}>
                          {yearOption}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {childDOBError && <p>{childDOBError}</p>}
              </div>
              <div className="form-group">
                <input type="email" value={email} onChange={handleEmailChange} className="input-field" />
                {emailError && <p>{emailError}</p>}
              </div>
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          ) : (
            <>
              <h2>{`${firstName} ${lastName}`}</h2>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Date of Birth:</strong> {`${day}/${month}/${year}`}</p>
            </>
          )}
        </section>

        <footer className="profile-footer">
          {error && <p className="error-message">{error}</p>}
          {editMode ? null : (
            <div className="form-buttons">
              <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
              <button className="edit-btn" onClick={() => { setEditMode(true); }}>Edit Profile</button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default ChildProfilePage;