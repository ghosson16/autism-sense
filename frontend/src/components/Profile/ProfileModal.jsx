// ProfileModal.js
import React from 'react';
import '../../styles/AuthModal.css';
const ProfileModal = ({ children, onClose }) => (
  <div className="auth-modal" onClick={onClose}>
    <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={onClose}>X</button>
      {children}
    </div>
  </div>
);

export default ProfileModal;
