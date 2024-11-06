import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import logoPath from '../../images/logo.png';
import defaultProfileImage from '../../images/default-profile.png';
import Modal from '../Profile/ProfileModal';
import ProfilePage from '../Profile/ProfilePage';
import '../../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Initialize childData from localStorage
  const [childData, setChildData] = useState(() => {
    const userFromStorage = localStorage.getItem('childData');
    if (userFromStorage) {
      return JSON.parse(userFromStorage);
    } else {
      navigate('/');
      return null;
    }
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Sync childData with localStorage whenever it changes
  useEffect(() => {
    if (childData) {
      localStorage.setItem('childData', JSON.stringify(childData));
    }
  }, [childData]);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('childData');
      navigate('/');
    } catch (error) {
      setError("Logout failed. Please try again.");
    }
  };

  // Function to open the profile modal
  const handleProfileClick = () => setIsProfileModalOpen(true);

  // Function to close the profile modal
  const closeProfileModal = () => setIsProfileModalOpen(false);

  // Function to handle profile update
  const handleProfileUpdate = (updatedData) => {
    const childDetails = updatedData.data;
    if (childDetails) {
      setChildData(childDetails); // Update state
      setIsProfileModalOpen(false); // Close modal
    } else {
      setError("Profile update failed. Please try again.");
    }
  };

  const handleJoinSpecialMode = () => navigate("/guest");

  const userProfileImage = childData?.photo || defaultProfileImage;
  const userName = childData ? `${childData.firstName} ${childData.lastName}` : 'First Name Last Name';

  return (
    <div className="container">
      {error && <p className="error-message">{error}</p>}

      <header className="navbar">
        <div className="navbar-section logo-section">
          <div className="ring-holder">
            <img src={logoPath} alt="Logo" className="logo-image" />
          </div>
        </div>
        <button className="navbar-section profile-section" onClick={handleProfileClick}>
          <div className="ring-holder">
            <img src={userProfileImage} alt="Profile" className="profile-image" />
          </div>
          <span>{userName}</span>
        </button>
        <div className="navbar-section logout-section">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="button-container">
        <button className="btn">
          <lord-icon
            src="https://cdn.lordicon.com/ofcynlwa.json"
            trigger="hover"
            colors="primary:#121131,secondary:#d1fad7,tertiary:#d1f3fa,quaternary:#f4f19c"
            style={{ width: "240px", height: "240px" }}
          ></lord-icon>
          <h2>Reports</h2>
        </button>

        <button className="btn" onClick={handleJoinSpecialMode}>
          <lord-icon
            src="https://cdn.lordicon.com/kiynvdns.json"
            trigger="hover"
            colors="primary:#121331,secondary:#e4e4e4,tertiary:#e4e4e4,quaternary:#d1fad7,quinary:#d1f3fa"
            style={{ width: "240px", height: "240px" }}
          ></lord-icon>
          <h2>Join Meeting</h2>
        </button>
      </section>

      {isProfileModalOpen && (
        <Modal onClose={closeProfileModal}>
          <ProfilePage
            child={childData}
            childId={childData?._id || childData?.id}
            onClose={closeProfileModal}
            onSave={handleProfileUpdate}
          />
        </Modal>
      )}

      <footer className="footer">
        <nav className="bottom-bar">
          <p>&copy; 2024 AutismSense. All rights reserved.</p>
        </nav>
      </footer>
    </div>
  );
};

export default Home;
