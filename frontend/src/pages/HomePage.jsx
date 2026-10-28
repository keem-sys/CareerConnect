import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, GraduationCap, Building2, ShieldCheck } from 'lucide-react';
import { useAuth } from "../context/AuthContext.jsx";
import StudentDashboardPage from './dashboards/StudentDashboardPage';
import CompanyDashboardPage from './dashboards/CompanyDashboardPage';
import AdminDashboardPage from './dashboards/AdminDashboardPage';

export default function HomePage() {
    const { user } = useAuth();

    if (!user) return <GuestLandingView />;
    if (user.role === 'STUDENT') return <StudentDashboardPage />;
    if (user.role === 'COMPANY') return <CompanyDashboardPage />;
    if (user.role === 'ADMIN') return <AdminDashboardPage />;

    return <GuestLandingView />;
}

function GuestLandingView() {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
            <div className="bg-card-bg border border-ui-border rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6">
                <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/30 px-3.5 py-1.5 rounded-full text-brand-accent text-xs font-mono font-semibold">
                    <Sparkles className="w-4 h-4 text-brand-accent" />
                    <span>Next-Gen Student Career & Internship Platform</span>
                </div>
                <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-text-main tracking-tight max-w-4xl mx-auto leading-tight">
                    Bridge the Gap Between Emerging Talent & Top Employers
                </h1>
                <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                    CareerConnect empowers university students to find verified internships and helps top industry employers recruit emerging tech talent.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <Link to="/signup" className="w-full sm:w-auto px-6 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl text-xs shadow-lg shadow-brand-primary/20 transition-all hover:scale-105 flex items-center justify-center space-x-2">
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto px-6 py-3.5 bg-app-bg hover:bg-card-hover border border-ui-border text-text-main font-semibold rounded-xl text-xs transition-all">
                        Sign In to Your Account
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card-bg border border-ui-border p-8 rounded-2xl shadow-lg space-y-3">
                    <div className="w-12 h-12 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-main">For Students</h3>
                    <p className="text-text-muted text-xs leading-relaxed">Apply directly to verified companies, showcase your skills, and receive real-time application status updates.</p>
                </div>
                <div className="bg-card-bg border border-ui-border p-8 rounded-2xl shadow-lg space-y-3">
                    <div className="w-12 h-12 bg-brand-mint/10 text-brand-mint border border-brand-mint/20 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-main">For Employers</h3>
                    <p className="text-text-muted text-xs leading-relaxed">Post internship opportunities, review verified student profiles, and recruit motivated developers directly.</p>
                </div>
                <div className="bg-card-bg border border-ui-border p-8 rounded-2xl shadow-lg space-y-3">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-main">Verified Postings</h3>
                    <p className="text-text-muted text-xs leading-relaxed">Vetted listings and verified student accounts ensure transparent, high-quality recruitment for all partners.</p>
                </div>
            </div>
        </div>
    );
}