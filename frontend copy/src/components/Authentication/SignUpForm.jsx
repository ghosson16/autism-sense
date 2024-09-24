import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/authService"; // Import sign-up function
import '../../styles/LoginForm.css';
import defaultProfileImage from '../../images/default-profile.png'; // Import local image
import { FaPencilAlt } from "react-icons/fa";


const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [childDOB, setChildDOB] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState(null);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [childDOBError, setChildDOBError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();

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

  const validateFirstName = (name) => /^[A-Za-z]{2,}$/.test(name);
  const validateLastName = (name) => /^[A-Za-z]{2,}$/.test(name);
  const validateChildDOB = (dob) => {
    const today = new Date();
    const selectedDate = new Date(dob);
    return selectedDate <= today;
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    setFirstNameError(!validateFirstName(value) ? "First name should be at least two letters long." : "");
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    setLastNameError(!validateLastName(value) ? "Last name should be at least two letters long." : "");
  };

  const handleChildDOBChange = (e) => {
    const value = e.target.value;
    setChildDOB(value);
    setChildDOBError(!validateChildDOB(value) ? "Child's date of birth cannot be in the future." : "");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!validateEmail(value) ? "Please enter a valid email address." : "");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(!validatePassword(value) ? "Password must be at least 8 characters long and contain both letters and numbers." : "");
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value !== password ? "Passwords do not match." : "");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!validateFirstName(firstName) || !validateLastName(lastName) || !validateChildDOB(childDOB) || !validateEmail(email) || !validatePassword(password) || password !== confirmPassword) {
      if (!validateFirstName(firstName)) setFirstNameError("First name should be at least two letters long.");
      if (!validateLastName(lastName)) setLastNameError("Last name should be at least two letters long.");
      if (!validateChildDOB(childDOB)) setChildDOBError("Child's date of birth cannot be in the future.");
      if (!validateEmail(email)) setEmailError("Please enter a valid email address.");
      if (!validatePassword(password)) setPasswordError("Password must be at least 8 characters long and contain both letters and numbers.");
      if (password !== confirmPassword) setConfirmPasswordError("Passwords do not match.");
      return;
    }

    const childData = {
      firstName,
      lastName,
      dob: childDOB,
      email,
      password,
      photo,
    };

    try {
      const result = await signUp(childData); // Use signUp function from authService
      if (result.message === "Child data saved successfully") {
        navigate("/home", { state: { user: result.user } });
      }
    } catch (err) {
      console.error("Sign up error:", err);
    }
  };

  const handleCancel = () => {
    navigate("/"); // Redirect to home or another route
  };

  return (
    <div className="form-container">
      <h2>Add Child</h2>
      <form onSubmit={handleSignUp}>
        <div className="form-photo">
          <div className="photo-ring">
            <img
              src={photo || defaultProfileImage}
              alt="Profile"
              className="photo-img"
            />
            <label htmlFor="photo-input" className="photo-pencil">
              <FaPencilAlt />
            </label>
            <input
              type="file"
              id="photo-input"
              accept="image/*"
              onChange={handlePhotoChange}
              className="photo-input"
            />
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={handleFirstNameChange}
            required
            className="input-field"
          />
          {firstNameError && <span className="error-message">{firstNameError}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={handleLastNameChange}
            required
            className="input-field"
          />
          {lastNameError && <span className="error-message">{lastNameError}</span>}
        </div>
        <div className="form-group dob-field-container">
          <input
            type="date"
            id="childDOB"
            value={childDOB}
            onChange={handleChildDOBChange}
            required
            max={new Date().toISOString().split("T")[0]}
            className="dob-input"
          />
          <label htmlFor="childDOB" className="dob-hint">Enter your birthday</label>
          {childDOBError && <span className="error-message">{childDOBError}</span>}
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
            className="input-field"
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="input-field"
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className="input-field"
          />
          {confirmPasswordError && <span className="error-message">{confirmPasswordError}</span>}
        </div>
        <div className="form-buttons">
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="add-child-btn">Add Child</button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
