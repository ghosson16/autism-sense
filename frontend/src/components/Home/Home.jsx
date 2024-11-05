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
  const [childId, setChildId] = useState(childData?._id || location.state?.id || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch child data if not already available
    if (!childData && childId) {
      setLoading(true);
      fetchChildData(childId)
        .then((user) => {
          if (user) {
            setChildData(user);
            setUserProfileImage(user.photo || defaultProfileImage);
            setUserName(`${user.firstName} ${user.lastName}`);
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
    } else if (childData) {
      // If child data is already available, set up necessary states
      setUserProfileImage(childData.photo || defaultProfileImage);
      setUserName(`${childData.firstName} ${childData.lastName}`);
      setChildId(childData._id || childData.id);
      setLoading(false);
    } else {
      // No child data or ID; redirect to login
      setError('No child ID available');
      navigate('/');
    }
  }, [childData, childId, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      setError("Logout failed. Please try again.");
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
  };

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
        <button
          className="navbar-section profile-section"
          onClick={handleProfileClick}
          disabled={loading}
        >
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

      <footer className="footer">
        <nav className="bottom-bar">
          <p>&copy; 2024 AutismSense. All rights reserved.</p>
         
        </nav>
      </footer>
    </div>
  );
};

export default Home;
