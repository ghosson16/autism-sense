import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { fetchChildData, updateChildData } from '../../services/childService'; // Import service functions
import { FaPencilAlt } from "react-icons/fa";
import defaultProfileImage from '../../images/default-profile.png';
import '../../styles/childProfilePage.css';

const ChildProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { childId } = useParams();
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

  // Fetch child data if it's not already in state
  useEffect(() => {
    if (!child && childId) {
      fetchChildData(childId)
        .then((data) => {
          setChild(data);
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setChildDOB(data.dob ? new Date(data.dob).toISOString().split('T')[0] : '');
          setEmail(data.email || '');
          setPhoto(data.photo || defaultProfileImage);
        })
        .catch((error) => {
          setError('Unable to load user data. Please try again.');
          console.error('Error fetching child data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (child) {
      setFirstName(child.firstName || '');
      setLastName(child.lastName || '');
      setChildDOB(child.dob ? new Date(child.dob).toISOString().split('T')[0] : '');
      setEmail(child.email || '');
      setPhoto(child.photo || defaultProfileImage);
      setLoading(false);
    }
  }, [child, childId]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  // Handle photo change for editing
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation functions
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

  const validateChildDOB = (dob) => {
    const today = new Date();
    const selectedDate = new Date(dob);
    return selectedDate <= today;
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (firstNameError || lastNameError || childDOBError || emailError) {
      return;
    }

    const updatedChildData = {
      firstName,
      lastName,
      dob: childDOB,
      email,
      photo,
    };

    try {
      const response = await updateChildData(childId, updatedChildData);
      if (response.status === 200) {
        setEditMode(false);
        setChild(response.data.updatedChild);
        navigate('/home', { replace: true, state: { user: response.data.updatedChild } });
      } else {
        console.error('Error updating child data');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <img src={photo || defaultProfileImage} alt="Profile" className="profile-img" />
        {editMode && (
          <label htmlFor="photo-input" className="photo-label">
            <FaPencilAlt />
            <p>Change Image</p>
          </label>
        )}
      </header>

      <section className="profile-details">
        {editMode ? (
          <>
            <div className="form-group">
              <input type="file" id="photo-input" accept="image/*" className="photo-input" onChange={handlePhotoChange} />
            </div>

            <div className="form-group">
              <input className="input-field" placeholder="First Name" type="text" value={firstName} onChange={handleFirstNameChange} />
              {firstNameError && <p>{firstNameError}</p>}
            </div>

            <div className="form-group">
              <input className="input-field" type="text" value={lastName} onChange={handleLastNameChange} />
              {lastNameError && <p>{lastNameError}</p>}
            </div>

            <div className="form-group">
              <input className="input-field" type="date" value={childDOB} onChange={handleChildDOBChange} max={new Date().toISOString().split('T')[0]} />
              {childDOBError && <p>{childDOBError}</p>}
            </div>

            <div className="form-group">
              <input className="input-field" type="email" value={email} onChange={handleEmailChange} />
              {emailError && <p>{emailError}</p>}
            </div>
          </>
        ) : (
          <>
            <h1>{`${firstName || 'First Name'} ${lastName || 'Last Name'}`}</h1>
            <p><strong>Email:</strong> {email || 'Not provided'}</p>
            <p><strong>Date of Birth:</strong> {childDOB ? new Date(childDOB).toLocaleDateString() : 'Not provided'}</p>
          </>
        )}
      </section>

      <footer className="profile-footer">
        {editMode ? (
          <div className="form-buttons">
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
          </div>
        ) : (
          <div className="form-buttons">
            <button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>
            <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default ChildProfilePage;
