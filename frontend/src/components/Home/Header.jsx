import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      backgroundColor: '#B3D9FF', // Light baby blue background
      padding: '5px 20px', // Reduced top/bottom padding for a slimmer look
      borderBottom: '2px solid black', // Consistent border thickness
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      boxSizing: 'border-box',
    },
    navbarSection: {
      display: 'flex',
      alignItems: 'center',
    },
    separator: {
      width: '2px',
      height: '100%', // Full height for consistency
      backgroundColor: 'black',
      margin: '0 20px',
    },
    profileImage: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      objectFit: 'cover',
      boxShadow: 'none', // Explicitly ensure no shadow
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      color: '#333',
      fontSize: '16px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
      backgroundColor: 'transparent', // Transparent background
      border: 'none', // No border for the button
      padding: '0',
    },
    profileName: {
      marginLeft: '10px', // Spacing between image and name
    },
    logoutButton: {
      backgroundColor: '#FF4D4D', // Retro red
      color: 'black',
      border: '2px solid black', // Black border for retro feel
      padding: '5px 10px', // Reduced padding for slimmer button
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      boxSizing: 'border-box',
      borderRadius: '0', // Square shape
      outline: 'none', // Remove outline
      boxShadow: 'none', // Ensure no shadow on default or hover
    },
  };

  return (
    <header style={styles.navbar}>
      <div style={styles.navbarSection}>
        {/* Animated Lordicon for Logo */}
        <lord-icon
          src="https://cdn.lordicon.com/ofzpbawy.json"
          trigger="hover"
          stroke="bold"
          colors="primary:#121331,secondary:#ebe6ef,tertiary:#e4e4e4,quaternary:#86ceed"
          style={{ width: '70px', height: '70px' }} // Kept logo size consistent
        ></lord-icon>
      </div>

      <div style={styles.separator}></div> {/* Separator line */}

      <div
        style={styles.profileSection}
        onClick={onProfileClick}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.4)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <div>
          <img src={userProfileImage} alt="Profile" style={styles.profileImage} />
        </div>
        <span style={styles.profileName}>{userName}</span>
      </div>

      <div style={styles.separator}></div> {/* Separator line */}

      <div style={styles.navbarSection}>
        <button
          style={styles.logoutButton}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#FF3333')} // Brighter hover color
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#FF4D4D')}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;