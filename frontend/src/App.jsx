import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import InternshipPage from "./pages/InternshipPage.jsx";
import PostInternshipPage from "./pages/PostInternshipPage.jsx";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-app-bg text-text-main font-sans selection:bg-brand-accent selection:text-app-bg">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/internships" element={<InternshipPage />} />
                            <Route path="/internships/new" element={<PostInternshipPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}