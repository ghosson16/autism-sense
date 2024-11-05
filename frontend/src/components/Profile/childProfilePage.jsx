import React, { useState } from 'react';
import { updateChildData, deleteChildAccount } from '../../services/childService';
import { useNavigate} from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import defaultProfileImage from '../../images/default-profile.png';
import '../../styles/AuthModal.css';

const ChildProfilePage = ({ child, childId, onClose, onSave }) => {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState(child?.firstName || '');
  const [lastName, setLastName] = useState(child?.lastName || '');
  const [childDOB, setChildDOB] = useState(child?.dob ? new Date(child.dob).toISOString().split('T')[0] : '');
  const [email, setEmail] = useState(child?.email || '');
  const [photo, setPhoto] = useState(child?.photo || defaultProfileImage);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [childDOBError, setChildDOBError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateChildDOB = (dob) => {
    const today = new Date();
    const selectedDate = new Date(dob);
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
  
    if (firstNameError || lastNameError || childDOBError || emailError) return;
  
    const updatedChildData = { firstName, lastName, dob: childDOB, email, photo };
  
    try {
      const response = await updateChildData(childId, updatedChildData);
      console.log("Response from updateChildData:", response);
      onSave(response);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating child data:', error);
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
        navigate("/")
      } catch (error) {
        console.error('Error deleting account:', error);
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

  const handleChildDOBChange = (e) => {
    const value = e.target.value;
    setChildDOB(value);
    setChildDOBError(!validateChildDOB(value) ? "Date of birth cannot be in the future." : '');
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address.' : '');
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <button className="close-btn" onClick={onClose}>X</button>

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
              <div className="form-group">
                <input type="date" value={childDOB} onChange={handleChildDOBChange} className="dob-input" />
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
              <h1>{`${firstName} ${lastName}`}</h1>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Date of Birth:</strong> {new Date(childDOB).toLocaleDateString()}</p>
            </>
          )}
        </section>

        <footer className="profile-footer">
          {error && <p className="error-message">{error}</p>}
          {editMode ? null : (
            <div className="form-buttons">
              <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
              <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default ChildProfilePage;
