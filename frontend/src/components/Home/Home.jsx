import React, { useEffect, useState } from 'react';
import '../../styles/Home.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchChildData } from '../../services/childService';
import { logout } from '../../services/authService';
import logoPath from '../../images/logo.png';
import defaultProfileImage from '../../images/default-profile.png';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [childData, setChildData] = useState(location.state?.user || null);
  const [userProfileImage, setUserProfileImage] = useState(defaultProfileImage);
  const [userName, setUserName] = useState('First Name Last Name');
  const [childId, setChildId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!childData) {
      const savedChildId = location.state?.id;
      if (savedChildId) {
        fetchChildData(savedChildId)
          .then((user) => {
            if (user) {
              setChildData(user);
              setUserProfileImage(user.photo || defaultProfileImage);
              setUserName(`${user.firstName} ${user.lastName}` || 'First Name Last Name');
              setChildId(user._id || user.id);
            } else {
              navigate('/login');
            }
          })
          .catch(() => {
            setError('Unable to load user data. Please try again.');
            navigate('/login');
          })
          .finally(() => setLoading(false));
      } else {
        setError('No child ID available');
        navigate('/login');
      }
    } else {
      setUserProfileImage(childData.photo || defaultProfileImage);
      setUserName(`${childData.firstName} ${childData.lastName}` || 'First Name Last Name');
      setChildId(childData._id || childData.id);
      setLoading(false);
    }
  }, [childData, navigate, location.state]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleProfileClick = () => {
    if (childId) {
      navigate(`/child-profile/${childId}`, { state: { user: childData, id: childId } });
    } else {
      console.error('Child ID not found. Please wait for data to load.');
    }
  };

  const handleJoinSpecialMode = () => {
      navigate("/guest");
    }

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

      <section className="dashboard-content">
        <div className="progress-report">
          <h2>Progress Overview</h2>
          <p>This section will display an overview of the child's progress.</p>
        </div>
        <div className="detailed-reports">
          <h2>Detailed Reports</h2>
          <p>This section will display detailed reports and analysis.</p>
        </div>
      </section>

      {/* Button to Join Zoom with Special Mode */}
      <section className="zoom-navigation">
      <button className="btn" onClick={handleJoinSpecialMode}>
        Join Meeting (Special Mode)
      </button>
      </section>

      <footer className="footer">
        <nav className="bottom-bar">
          <p>&copy; 2024 AutismSense. All rights reserved.</p>
        </nav>
      </footer>
    </div>
  );
};

export default Home;
