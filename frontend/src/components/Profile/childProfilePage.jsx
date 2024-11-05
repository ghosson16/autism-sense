import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { fetchChildData, updateChildData, deleteChildAccount } from '../../services/childService';
import { FaPencilAlt } from "react-icons/fa";
import defaultProfileImage from '../../images/default-profile.png';
import '../../styles/AuthModal.css';

const ChildProfilePage = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Added navigate hook
  const { childId } = useParams();

  // State variables
  const [child, setChild] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [childDOB, setChildDOB] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [childDOBError, setChildDOBError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Fetch child data on load if not in state
  useEffect(() => {
    if (!child && childId) {
      fetchChildData(childId)
        .then((data) => {
          setChild(data);
          setInitialFormData(data);
        })
        .catch((error) => {
          setError('Unable to load user data. Please try again.');
          console.error('Error fetching child data:', error);
        })
        .finally(() => setLoading(false));
    } else if (child) {
      setInitialFormData(child);
      setLoading(false);
    }
  }, [child, childId]);

  // Utility Functions
  const setInitialFormData = (data) => {
    setFirstName(data.firstName || '');
    setLastName(data.lastName || '');
    setChildDOB(data.dob ? new Date(data.dob).toISOString().split('T')[0] : '');
    setEmail(data.email || '');
    setPhoto(data.photo || defaultProfileImage);
  };

  const validateChildDOB = (dob) => {
    const today = new Date();
    const selectedDate = new Date(dob);
    return selectedDate <= today;
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  // Event Handlers
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this account?');
      if (confirmDelete) {
        await deleteChildAccount(childId);
        alert('Account deleted successfully.');
        onClose();  // Close the modal on delete
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete the account. Please try again.');
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
    setChildDOBError(!validateChildDOB(value) ? "Child's date of birth cannot be in the future." : '');
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address.' : '');
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (firstNameError || lastNameError || childDOBError || emailError) return;
  
    const updatedChildData = { firstName, lastName, dob: childDOB, email, photo };
  
    try {
      const response = await updateChildData(childId, updatedChildData);
      if (response.status === 200) {
        setEditMode(false);
        setChild(response.data.updatedChild);
        navigate('/home', { state: { user: response.data.updatedChild } }); // Pass updated data as state
      }
    } catch (error) {
      console.error('Error updating child data:', error);
    }
  };
  

  // Render
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
            <div className="form-container">
              <div className="form-photo">
                <div className="photo-ring">
                  <input type="file" id="photo-input" accept="image/*" onChange={handlePhotoChange} className="photo-input"/>
                </div>
              </div>
              <div className="form-group">
                <input type="text" value={firstName} onChange={handleFirstNameChange} placeholder="First Name" className="input-field" />
                {firstNameError && <p>{firstNameError}</p>}
              </div>
              <div className="form-group">
                <input type="text" value={lastName} onChange={handleLastNameChange} placeholder="Last Name" className="input-field"/>
                {lastNameError && <p>{lastNameError}</p>}
              </div>
              <div className="form-group">
                <input type="date" value={childDOB} onChange={handleChildDOBChange} className="dob-input" />
                {childDOBError && <p>{childDOBError}</p>}
              </div>
              <div className="form-group">
                <input type="email" value={email} onChange={handleEmailChange} className="input-field"/>
                {emailError && <p>{emailError}</p>}
              </div>
            </div>
          ) : (
            <>
              <h1>{`${firstName} ${lastName}`}</h1>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Date of Birth:</strong> {new Date(childDOB).toLocaleDateString()}</p>
            </>
          )}
        </section>

        <footer className="profile-footer">
          {editMode ? (
            <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
          ) : (
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
