import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components & Guards
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';

// Pages
import ProfilePage from './pages/ProfilePage';
import AdminStudentPage from './pages/AdminStudentPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import PostInternshipPage from './pages/PostInternshipPage';
import NotFoundPage from './pages/NotFoundPage';
import InternshipPage from "./pages/InternshipPage.jsx";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-app-bg text-text-main font-sans selection:bg-brand-accent selection:text-app-bg">
                    <Navbar />
                    <main>
                        <Routes>
                            {/* PUBLIC ROUTES (Anyone can view) */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/dashboard" element={<Navigate to="/" replace />} />
                            <Route path="/internships" element={<InternshipPage />} />

                            {/* GUEST-ONLY ROUTES (Redirects logged-in users to /) */}
                            <Route element={<PublicOnlyRoute />}>
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupPage />} />
                            </Route>

                            {/* STUDENT PROTECTED ROUTES */}
                            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/settings" element={<AdminStudentPage />} />
                            </Route>

                            {/* EMPLOYER PROTECTED ROUTES */}
                            <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
                                <Route path="/internships/new" element={<PostInternshipPage />} />
                            </Route>

                            {/* ADMIN PROTECTED ROUTES */}
                            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                <Route path="/admin/students" element={<AdminStudentPage />} />
                            </Route>

                            {/* 404 CATCH-ALL */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}