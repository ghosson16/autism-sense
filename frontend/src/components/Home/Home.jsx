import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchChildData } from '../../services/childService';
import { logout } from '../../services/authService';
import logoPath from '../../images/logo.png';
import defaultProfileImage from '../../images/default-profile.png';
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import Modal from '../Profile/ProfileModal';
import ChildProfilePage from '../Profile/childProfilePage';
import '../../styles/Home.css';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [childData, setChildData] = useState(() => {
    return JSON.parse(localStorage.getItem('childData')) || location.state?.user || null;
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!childData) {
      // Fetch data if not available in state or local storage
      fetchChildData(location.state?.id)
        .then((user) => {
          if (user) {
            setChildData(user);
            localStorage.setItem('childData', JSON.stringify(user));
          } else {
            throw new Error("User data is unavailable");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setError("Unable to load user data. Please try again.");
          navigate('/');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [childData, navigate, location.state]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('childData');
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      setError("Logout failed. Please try again.");
    }
  };

  const handleProfileClick = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const handleProfileUpdate = (updatedData) => {
    console.log("Updated data:", updatedData); // Log updated data for verification
  
    const childDetails = updatedData.data;
  
    setChildData(childDetails);
    localStorage.setItem('childData', JSON.stringify(childDetails));
    setIsProfileModalOpen(false);
  };
  

  const handleJoinSpecialMode = () => navigate("/guest");

  const userProfileImage = childData?.photo || defaultProfileImage;
  const userName = childData ? `${childData.firstName} ${childData.lastName}` : 'First Name Last Name';

  return (
    <div className="container">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <header className="navbar">
        <div className="navbar-section logo-section">
          <div className="ring-holder">
            <img src={logoPath} alt="Logo" className="logo-image" />
          </div>
        </div>
        <button className="navbar-section profile-section" onClick={handleProfileClick} disabled={loading}>
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
          <ChildProfilePage
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
