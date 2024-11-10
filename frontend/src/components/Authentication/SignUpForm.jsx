import React, { useState, useRef } from "react";
import { signUp } from "../../services/authService";
import '../../styles/AuthModal.css';
import { useNavigate } from "react-router-dom";
import defaultProfileImage from '../../images/default-profile.png';
import { FaPencilAlt } from "react-icons/fa";
import EnterInput from '../EnterInput';

const SignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [childDOB, setChildDOB] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState(null);

  const navigate = useNavigate();

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [childDOBError, setChildDOBError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const lastNameRef = useRef();
  const dobRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

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
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateFirstName(firstName) || !validateLastName(lastName) || !validateChildDOB(childDOB) || !validateEmail(email) || !validatePassword(password) || password !== confirmPassword) {
      setFirstNameError(!validateFirstName(firstName) ? "First name should be at least two letters long." : "");
      setLastNameError(!validateLastName(lastName) ? "Last name should be at least two letters long." : "");
      setChildDOBError(!validateChildDOB(childDOB) ? "Child's date of birth cannot be in the future." : "");
      setEmailError(!validateEmail(email) ? "Please enter a valid email address." : "");
      setPasswordError(!validatePassword(password) ? "Password must be at least 8 characters long and contain both letters and numbers." : "");
      setConfirmPasswordError(password !== confirmPassword ? "Passwords do not match." : "");
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
      const result = await signUp(childData);

      if (result && result.message === "Child data saved successfully" && result.user) {
        localStorage.setItem('childData', JSON.stringify(result.user));
        navigate("/home");
      } else {
        setSubmitError("Sign-up completed, but could not retrieve user data.");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setSubmitError("This email is already in use. Please use a different email.");
      } else {
        setSubmitError("An error occurred during sign up. Please try again.");
      }
    }
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
              <FaPencilAlt /> Add Photo
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
          <EnterInput
            placeholder="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setFirstNameError(!validateFirstName(e.target.value) ? "First name should be at least two letters long." : "");
            }}
            onEnter={() => lastNameRef.current.focus()}
            required
          />
          {firstNameError && <span className="error-message">{firstNameError}</span>}
        </div>
        <div className="form-group">
          <EnterInput
            placeholder="Last Name"
            ref={lastNameRef}
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setLastNameError(!validateLastName(e.target.value) ? "Last name should be at least two letters long." : "");
            }}
            onEnter={() => dobRef.current.focus()}
            required
          />
          {lastNameError && <span className="error-message">{lastNameError}</span>}
        </div>
        <div className="form-group dob-field-container">
          <EnterInput
            type="date"
            id="childDOB"
            ref={dobRef}
            value={childDOB}
            onChange={(e) => {
              setChildDOB(e.target.value);
              setChildDOBError(!validateChildDOB(e.target.value) ? "Child's date of birth cannot be in the future." : "");
            }}
            onEnter={() => emailRef.current.focus()}
            required
            max={new Date().toISOString().split("T")[0]}
            className="dob-input"
          />
          {childDOBError && <span className="error-message">{childDOBError}</span>}
        </div>
        <div className="form-group">
          <EnterInput
            type="email"
            placeholder="Email"
            ref={emailRef}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(!validateEmail(e.target.value) ? "Please enter a valid email address." : "");
            }}
            onEnter={() => passwordRef.current.focus()}
            required
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>
        <div className="form-group">
          <EnterInput
            type="password"
            placeholder="Password"
            ref={passwordRef}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(!validatePassword(e.target.value) ? "Password must be at least 8 characters long and contain both letters and numbers." : "");
            }}
            onEnter={() => confirmPasswordRef.current.focus()}
            required
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>
        <div className="form-group">
        <EnterInput
        type="password"
        placeholder="Confirm Password"
        ref={confirmPasswordRef}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setConfirmPasswordError(e.target.value !== password ? "Passwords do not match." : "");
        }}
        onEnter={() => handleSignUp({ preventDefault: () => {} })}
        required
        />
          {confirmPasswordError && <span className="error-message">{confirmPasswordError}</span>}
        </div>
        {submitError && <span className="error-message">{submitError}</span>}
        <div className="form-buttons" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button type="submit" className="add-child-btn">Sign up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
