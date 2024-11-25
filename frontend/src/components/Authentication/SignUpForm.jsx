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
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
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
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState("");

  const lastNameRef = useRef();
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
  
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

  const getFirstNameError = (name) => {
    if (name.length < 2) return "First name should be at least two letters long.";
    if (name.length > 50) return "First name should not exceed 50 characters.";
    return "";
  };

  const getLastNameError = (name) => {
    if (name.length < 2) return "Last name should be at least two letters long.";
    if (name.length > 50) return "Last name should not exceed 50 characters.";
    return "";
  };

  const getEmailError = (email) => {
    if (!validateEmail(email)) return "Please enter a valid email address, e.g., example@example.com.";
    if (email.length > 320) return "Email should not exceed 320 characters.";
    return "";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const formattedDOB = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    if (!validateFirstName(firstName) || !validateLastName(lastName) || !day || !month || !year || !validateEmail(email) || !validatePassword(password) || password !== confirmPassword) {
      setFirstNameError(getFirstNameError(firstName));
      setLastNameError(getLastNameError(lastName));
      setChildDOBError(!day || !month || !year ? "Please complete the date of birth." : "");
      setEmailError(getEmailError(email));
      setPasswordError(!validatePassword(password) ? "Password must be at least 8 characters long and contain both letters and numbers." : "");
      setConfirmPasswordError(password !== confirmPassword ? "Passwords do not match." : "");
      return;
    }

    const childData = {
      firstName,
      lastName,
      dob: formattedDOB,
      email,
      password,
      photo,
    };

    try {
      const result = await signUp(childData);

      if (result && result.message === "Child data saved successfully" && result.user) {
        localStorage.setItem('childData', JSON.stringify(result.user));
        setSubmitSuccess("Sign-up successful! Welcome to AutismSense.");
        navigate("/home");
      } else {
        setSubmitError("Sign-up completed, but could not retrieve user data.");
      }
    } catch (err) {
      setSubmitError(err.message || "An error occurred during sign-up. Please try again.");
    }
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z]/g, ''); // Remove invalid characters
    setFirstName(value);
    setFirstNameError(getFirstNameError(value));
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z]/g, ''); // Remove invalid characters
    setLastName(value);
    setLastNameError(getLastNameError(value));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.replace(/\s/g, ''); // Remove spaces
    setEmail(value);
    setEmailError(getEmailError(value));
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  // Helper function to determine the number of days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
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
            onChange={handleFirstNameChange}
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
            onChange={handleLastNameChange}
            onEnter={() => emailRef.current.focus()}
            required
          />
          {lastNameError && <span className="error-message">{lastNameError}</span>}
        </div>

        <div className="form-group dob-field-container">
          <label>Date of Birth:</label>
          <div style={{ display: "flex", gap: "5px" }}>
            <select aria-label="Day" value={day} onChange={(e) => setDay(e.target.value)} required>
              <option value="">Day</option>
              {[...Array(getDaysInMonth(month, year))].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <select aria-label="Month" value={month} onChange={(e) => setMonth(e.target.value)} required>
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => (
                <option
                  key={i + 1}
                  value={i + 1}
                  disabled={year == currentYear && i + 1 > currentMonth}
                >
                  {i + 1}
                </option>
              ))}
            </select>

            <select aria-label="Year" value={year} onChange={(e) => setYear(e.target.value)} required>
              <option value="">Year</option>
              {[...Array(100)].map((_, i) => {
                const yearOption = currentYear - i;
                return (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                );
              })}
            </select>
          </div>
          {childDOBError && <span className="error-message">{childDOBError}</span>}
        </div>

        <div className="form-group">
          <EnterInput
            type="email"
            placeholder="Email"
            ref={emailRef}
            value={email}
            onChange={handleEmailChange}
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
        {submitSuccess && (<div role="alert" style={{ color: "green" }}>{submitSuccess}</div>)}
        {submitError && <div className="error-message">{submitError}</div>}
        <div className="form-buttons" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button type="submit" className="add-child-btn">Sign up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;