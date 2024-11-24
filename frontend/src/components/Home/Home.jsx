import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import Header from './Header';
import Modal from '../Profile/ProfileModal';
import ProfilePage from '../Profile/ProfilePage';
import '../../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const [childData, setChildData] = useState(() => {
    const userFromStorage = localStorage.getItem('childData');
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (childData) {
      localStorage.setItem('childData', JSON.stringify(childData));
    }
  }, [childData]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate('/');
    } catch (error) {
      setError("Logout failed. Please try again.");
    }
  };

  const handleProfileClick = () => setIsProfileModalOpen(true);

  const closeProfileModal = () => setIsProfileModalOpen(false);

  const handleProfileUpdate = (updatedData) => {
    const childDetails = updatedData.data;
    if (childDetails) {
      setChildData(childDetails);
      setIsProfileModalOpen(false);
    } else {
      setError("Profile update failed. Please try again.");
    }
  };

  const handleJoinSpecialMode = () => navigate("/guest");

  return (
    <div className="container">
      {error && <p className="error-message">{error}</p>}

      <Header
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        childData={childData}
      />

      <section className="button-container">
      <button className="btn" onClick={() => navigate("/reportsPage")}>
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