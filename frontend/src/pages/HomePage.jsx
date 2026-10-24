import React from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    FileText,
    UserCheck,
    ArrowRight,
    Building2,
    Users,
    PlusCircle,
    GraduationCap,
    Sparkles,
    ShieldCheck,
    TrendingUp
} from 'lucide-react';
import {useAuth} from "../context/AuthContext.jsx";

export default function HomePage() {
    const { user } = useAuth();

    // GUEST VIEW (NOT LOGGED IN)
    if (!user) {
        return <GuestLandingView />;
    }

    // COMPANY / EMPLOYER VIEW
    if (user.role === 'COMPANY') {
        return <CompanyDashboardView user={user} />;
    }

    // ADMIN VIEW
    if (user.role === 'ADMIN') {
        return <AdminDashboardView user={user} />;
    }

    // STUDENT VIEW (DEFAULT)
    return <StudentDashboardView user={user} />;
}


/*
   GUEST LANDING VIEW (NOT LOGGED IN)
*/
function GuestLandingView() {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">

            {/* Hero Section */}
            <div className="bg-card-bg border border-ui-border rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden text-center space-y-6">
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
                    <Link
                        to="/signup"
                        className="w-full sm:w-auto px-6 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl text-xs shadow-lg shadow-brand-primary/20 transition-all hover:scale-105 flex items-center justify-center space-x-2"
                    >
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-6 py-3.5 bg-app-bg hover:bg-card-hover border border-ui-border text-text-main font-semibold rounded-xl text-xs transition-all"
                    >
                        Sign In to Your Account
                    </Link>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card-bg border border-ui-border p-8 rounded-2xl shadow-lg space-y-3">
                    <div className="w-12 h-12 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-main">For Students</h3>
                    <p className="text-text-muted text-xs leading-relaxed">
                        Apply directly to verified companies, showcase your skills, and receive real-time application status updates.
                    </p>
                </div>

                <div className="bg-card-bg border border-ui-border p-8 rounded-2xl shadow-lg space-y-3">
                    <div className="w-12 h-12 bg-brand-mint/10 text-brand-mint border border-brand-mint/20 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-main">For Employers</h3>
                    <p className="text-text-muted text-xs leading-relaxed">
                        Post internship opportunities, review verified student profiles, and recruit motivated developers directly.
                    </p>
                </div>

                <div className="bg-card-bg border border-ui-border p-8 rounded-2xl shadow-lg space-y-3">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-main">Verified Postings</h3>
                    <p className="text-text-muted text-xs leading-relaxed">
                        Vetted listings and verified student accounts ensure transparent, high-quality recruitment for all partners.
                    </p>
                </div>
            </div>

        </div>
    );
}


/* STUDENT DASHBOARD VIEW (LOGGED IN AS STUDENT)
 */
function StudentDashboardView({ user }) {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

            {/* Welcome, Banner */}
            <div className="bg-card-bg border border-ui-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-brand-mint text-xs font-mono font-semibold">
                        <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
                        <span>STUDENT PORTAL</span>
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-main">
                        Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-text-muted text-xs sm:text-sm max-w-2xl">
                        Explore active internship postings, track your application statuses, and keep your student profile up to date.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-xl">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Available Postings</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">12 Positions</h3>
                    </div>
                </div>

                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-emerald-50 text-brand-mint border border-emerald-200 rounded-xl">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Submitted Applications</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">2 Active</h3>
                    </div>
                </div>

                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Profile Status</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">Verified</h3>
                    </div>
                </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card-bg border border-ui-border p-8 rounded-3xl shadow-lg flex flex-col justify-between hover:border-brand-accent/50 transition-all group">
                    <div>
                        <div className="w-12 h-12 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-text-main mb-2">Explore Internships</h3>
                        <p className="text-text-muted text-xs leading-relaxed">
                            Browse positions from verified tech employers, check requirements, and submit your application.
                        </p>
                    </div>
                    <Link to="/internships" className="mt-6 inline-flex items-center space-x-2 text-xs font-semibold text-brand-accent hover:underline">
                        <span>View All Internships</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-card-bg border border-ui-border p-8 rounded-3xl shadow-lg flex flex-col justify-between hover:border-brand-accent/50 transition-all group">
                    <div>
                        <div className="w-12 h-12 bg-emerald-50 text-brand-mint border border-emerald-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-text-main mb-2">Track Applications</h3>
                        <p className="text-text-muted text-xs leading-relaxed">
                            Check real-time application status updates ("Pending Review", "Interview Scheduled", "Approved").
                        </p>
                    </div>
                    <Link to="/my-applications" className="mt-6 inline-flex items-center space-x-2 text-xs font-semibold text-brand-mint hover:underline">
                        <span>View My Statuses</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

        </div>
    );
}


/* COMPANY / EMPLOYER DASHBOARD VIEW (LOGGED IN AS COMPANY)
 */
function CompanyDashboardView({ user }) {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

            {/* Welcome Banner */}
            <div className="bg-card-bg border border-ui-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/30 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-semibold">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>EMPLOYER PORTAL</span>
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-main">
                        Welcome, {user.name}! 🏢
                    </h1>
                    <p className="text-text-muted text-xs sm:text-sm max-w-2xl">
                        Manage your internship opportunities, review incoming student applications, and recruit top emerging talent.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-xl">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Active Postings</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">3 Jobs</h3>
                    </div>
                </div>

                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-emerald-50 text-brand-mint border border-emerald-200 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Total Applicants</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">18 Students</h3>
                    </div>
                </div>

                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Pending Reviews</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">5 Applications</h3>
                    </div>
                </div>
            </div>

            {/* Action CTA */}
            <div className="bg-card-bg border border-ui-border p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-heading text-xl font-bold text-text-main mb-1">Post a New Internship Position</h3>
                    <p className="text-text-muted text-xs max-w-xl">
                        Create a new internship listing to start receiving applications from qualified software development students.
                    </p>
                </div>
                <Link
                    to="/internships"
                    className="px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl text-xs shadow-lg shadow-brand-primary/20 shrink-0 flex items-center space-x-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Internship</span>
                </Link>
            </div>

        </div>
    );
}


/* ADMIN DASHBOARD VIEW (LOGGED IN AS ADMIN)
 */
function AdminDashboardView({ user }) {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

            {/* Welcome Banner */}
            <div className="bg-card-bg border border-ui-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-600 text-xs font-mono font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>ADMINISTRATOR CONTROL PANEL</span>
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-main">
                        System Overview, {user.name} 🛡️
                    </h1>
                    <p className="text-text-muted text-xs sm:text-sm max-w-2xl">
                        Manage student accounts, verify employer registrations, and oversee all active platform internship postings.
                    </p>
                </div>
            </div>

            {/* Admin Action Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card-bg border border-ui-border p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-2xl flex items-center justify-center mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-text-main mb-2">Student Directory Management</h3>
                        <p className="text-text-muted text-xs leading-relaxed">
                            View, search, and manage registered student accounts in the database.
                        </p>
                    </div>
                    <Link to="/admin/students" className="mt-6 inline-flex items-center space-x-2 text-xs font-semibold text-brand-accent hover:underline">
                        <span>Manage Students</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-card-bg border border-ui-border p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl flex items-center justify-center mb-4">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-text-main mb-2">Company Management</h3>
                        <p className="text-text-muted text-xs leading-relaxed">
                            Approve new employer registrations and review posted internship listings.
                        </p>
                    </div>
                    <Link to="/companies" className="mt-6 inline-flex items-center space-x-2 text-xs font-semibold text-amber-600 hover:underline">
                        <span>Manage Employers</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

        </div>
    );
}