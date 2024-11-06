import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoPath from '../../images/logo.png';
import defaultProfileImage from '../../images/default-profile.png';

const Header = ({ onLogout, onProfileClick, childData }) => {
  const navigate = useNavigate();
  const userProfileImage = childData?.photo || defaultProfileImage;
  const userName = childData ? `${childData.firstName} ${childData.lastName}` : 'First Name Last Name';

  // Inline styles for the header component
  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f4f4f4',
      padding: '10px 20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
    },
    navbarSection: {
      display: 'flex',
      alignItems: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    ringHolder: {
      width: '40px',
      height: '40px',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    profileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    logoImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    profileSection: {
      background: 'none',
      border: 'none',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      color: '#333',
      fontSize: '16px',
      fontWeight: 500,
      marginLeft: '10px',
    },
    logoutButton: {
      backgroundColor: '#ff4d4d',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      fontSize: '14px',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
      marginRight: '25px',
    },
    logoutButtonHover: {
      backgroundColor: '#ff1a1a',
    },
  };

  return (
    <header style={styles.navbar}>
      <div style={{ ...styles.navbarSection, ...styles.ringHolder }}>
        <img src={logoPath} alt="Logo" style={styles.logoImage} />
      </div>

      <button
        style={{ ...styles.navbarSection, ...styles.profileSection }}
        onClick={onProfileClick}
      >
        <div style={styles.ringHolder}>
          <img src={userProfileImage} alt="Profile" style={styles.profileImage} />
        </div>
        <span>{userName}</span>
      </button>

      <div style={styles.navbarSection}>
        <button
          style={styles.logoutButton}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;