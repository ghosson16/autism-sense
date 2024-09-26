import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import SignUpForm from "./components/Authentication/SignUpForm";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/Authentication/LoginForm"; // Fix component name
import Home from "./components/Home/Home";
import AboutUs from './components/AboutUs';
import ForgetPasswordForm from './components/Authentication/ForgetPasswordForm'; // Import the ForgetPasswordForm component
import ChildProfilePage from './components/Profile/childProfilePage'; // Import the ChildProfilePage component
import DetectEmotion from './components/EmotionDetection/EmotionDetection';
import ResetPassword from './components/Authentication/ResetPassword' ; 
import CreateMeeting from './components/zoom/createMeetings' ; 
import Meetings from "./components/zoom/meetings";

import ZoomLinkInput from './components/onlineMeeting/ZoomLinkInput';
import MeetingPage from './components/onlineMeeting/MeetingPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/login"element={<LoginForm/> } />
        <Route path="/home" element= {<Home/> }/>
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/forget-password" element={<ForgetPasswordForm />} /> {/* Forgot Password Route */}
        <Route path="/child-profile/:childId" element={<ChildProfilePage />} /> {/* Child Profile Page */}
        <Route path="/detect-emotion" element={<DetectEmotion/>} /> {/* Detect Emotion Route */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/create-meeting" element={<CreateMeeting />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/linkpage" element={<ZoomLinkInput />} />
        <Route path="/meeting" element={<MeetingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
