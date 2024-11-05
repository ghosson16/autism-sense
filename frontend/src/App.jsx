import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import SignUpForm from "./components/Authentication/SignUpForm";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/Authentication/LoginForm";
import Home from "./components/Home/Home";
import AboutUs from './components/AboutUs';
import ForgetPasswordForm from './components/Authentication/ForgetPasswordForm';
import ChildProfilePage from './components/Profile/childProfilePage';
import ResetPassword from './components/Authentication/ResetPassword';
import CreateMeetingPage from './components/TwilioVideo/HostMeeting';
import JoinMeetingPage from './components/TwilioVideo/GuestMeeting';

import AuthRoute from './components/AuthRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/forget-password" element={<ForgetPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/host" element={<CreateMeetingPage />} />

        {/* Protected Routes */}
        <Route path="/home" element={ <AuthRoute> <Home /> </AuthRoute> } />
        <Route path="/child-profile/:childId" element={ <AuthRoute> <ChildProfilePage /> </AuthRoute> } />
        <Route path="/guest" element={ <AuthRoute> <JoinMeetingPage /> </AuthRoute> } />
      </Routes>
    </Router>
  );
}

export default App;
