import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    GraduationCap,
    LayoutDashboard,
    Briefcase,
    FileText,
    Building2,
    Users,
    User,
    Search,
    Bell,
    Menu,
    X,
    LogOut,
    LogIn,
    UserPlus
} from 'lucide-react';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
                ? 'text-brand-accent bg-brand-accent/10 border border-brand-accent/20 font-semibold'
                : 'text-text-muted hover:text-text-main hover:bg-card-bg'
        }`;

    const getNavLinks = () => {
        // GUEST LINKS (NOT LOGGED IN)
        if (!user) {
            return [
                { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
                { to: '/internships', label: 'Internships', icon: Briefcase },
                { to: '/companies', label: 'Companies', icon: Building2 },
            ];
        }

        // STUDENT LINKS
        if (user.role === 'STUDENT') {
            return [
                { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
                { to: '/internships', label: 'Internships', icon: Briefcase },
                { to: '/my-applications', label: 'My Applications', icon: FileText },
                { to: '/profile', label: 'My Profile', icon: User },
            ];
        }

        // COMPANY / EMPLOYER LINKS
        if (user.role === 'COMPANY') {
            return [
                { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
                { to: '/internships', label: 'Manage Postings', icon: Briefcase },
                { to: '/my-applications', label: 'Applicants', icon: Users },
            ];
        }

        // ADMIN LINKS
        if (user.role === 'ADMIN') {
            return [
                { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
                { to: '/admin/students', label: 'Students', icon: Users },
                { to: '/companies', label: 'Companies', icon: Building2 },
                { to: '/internships', label: 'Internships', icon: Briefcase },
            ];
        }

        return [];
    };

    const navLinks = getNavLinks();

    return (
        <header className="sticky top-0 z-50 w-full bg-app-bg/85 backdrop-blur-md border-b border-ui-border">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Branding & Logo */}
                    <div className="flex items-center space-x-3">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="bg-brand-accent/10 border border-brand-accent/30 p-2.5 rounded-2xl text-brand-accent group-hover:scale-105 transition-transform duration-200">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-heading font-extrabold text-xl text-text-main tracking-tight group-hover:text-brand-accent transition-colors">
                                        CareerConnect
                                    </span>
                                    <span className="font-mono text-[10px] bg-card-bg border border-ui-border text-brand-accent px-2 py-0.5 rounded-full font-semibold">
                                        CPUT
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Dynamic Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={navLinkClass}
                                    end={link.end}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{link.label}</span>
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* Actions & User Profile */}
                    <div className="hidden md:flex items-center space-x-4">

                        {/* Search Shortcut */}
                        <button className="flex items-center space-x-2 bg-card-bg/80 border border-ui-border hover:border-brand-accent/40 text-text-muted hover:text-text-main px-3 py-1.5 rounded-xl text-xs transition-all">
                            <Search className="w-3.5 h-3.5 text-brand-accent" />
                            <span>Search...</span>
                            <kbd className="font-mono bg-app-bg text-[10px] text-text-muted border border-ui-border px-1.5 py-0.5 rounded-md">
                                Ctrl K
                            </kbd>
                        </button>

                        {/* IF USER IS LOGGED IN */}
                        {user ? (
                            <div className="flex items-center space-x-3 pl-2 border-l border-ui-border">
                                <button className="relative p-2 text-text-muted hover:text-text-main bg-card-bg/50 hover:bg-card-bg border border-ui-border rounded-xl transition-colors">
                                    <Bell className="w-4 h-4" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-mint rounded-full animate-pulse" />
                                </button>

                                <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {getInitials(user.name)}
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-text-main leading-tight">
                                        {user.name}
                                    </span>
                                    <span className="font-mono text-[10px] font-semibold text-brand-mint bg-brand-mint/10 border border-brand-mint/20 px-1.5 py-0.5 rounded mt-0.5 w-fit">
                                        {user.role || 'STUDENT'}
                                    </span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    title="Log Out"
                                    className="p-2 ml-1 mr-1 text-text-muted hover:text-rose-600 bg-card-bg hover:bg-rose-50 border border-ui-border hover:border-rose-200 rounded-xl transition-all cursor-pointer shadow-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            /* IF NO USER IS LOGGED IN (GUEST STATE) */
                            <div className="flex items-center space-x-3 pl-2 border-l border-ui-border">
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-1.5 text-xs font-medium text-text-muted hover:text-text-main px-3 py-2 rounded-xl hover:bg-card-bg/60 transition-all"
                                >
                                    <LogIn className="w-3.5 h-3.5" />
                                    <span>Sign In</span>
                                </Link>

                                <Link
                                    to="/signup"
                                    className="flex items-center space-x-1.5 text-xs font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white px-4 py-2 rounded-xl shadow-md shadow-brand-primary/20 hover:scale-105 transition-all"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span>Register</span>
                                </Link>
                            </div>
                        )}

                    </div>

                    {/* Hamburger Toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2.5 rounded-xl text-text-muted hover:text-text-main bg-card-bg border border-ui-border"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>

                {/* MOBILE MENU OVERLAY */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-ui-border space-y-2 animate-fadeIn">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={navLinkClass}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{link.label}</span>
                                </NavLink>
                            );
                        })}

                        {/* Mobile Auth / Profile Section */}
                        <div className="pt-4 mt-4 border-t border-ui-border px-3">
                            {user ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-xs">
                                            {getInitials(user.name)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-text-main">{user.name}</p>
                                            <p className="font-mono text-[10px] text-brand-mint">{user.studentNumber || user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center text-xs font-medium text-text-main bg-card-bg border border-ui-border py-2.5 rounded-xl"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-center text-xs font-semibold text-white bg-brand-primary py-2.5 rounded-xl shadow-md"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}