import React, { useState } from 'react';
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
    UserPlus,
    PlusCircle
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
        `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
            isActive
                ? 'text-brand-primary bg-slate-100 font-bold'
                : 'text-text-muted hover:text-text-main hover:bg-slate-50'
        }`;

    const getNavLinks = () => {
        // GUEST LINKS
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
                { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
                { to: '/internships', label: 'Internships', icon: Briefcase },
                { to: '/applications', label: 'My Applications', icon: FileText },
                { to: '/profile', label: 'My Profile', icon: User },
            ];
        }

        // COMPANY / EMPLOYER LINKS
        if (user.role === 'COMPANY') {
            return [
                { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
                { to: '/company/postings', label: 'My Postings', icon: Briefcase },
                { to: '/company/applicants', label: 'Applicants', icon: Users },
                { to: '/internships', label: 'Browse Internships', icon: Search, end: true },
            ];
        }

        // ADMIN LINKS
        if (user.role === 'ADMIN') {
            return [
                { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
                { to: '/admin/students', label: 'Students', icon: Users },
                { to: '/companies', label: 'Companies', icon: Building2 },
                { to: '/internships', label: 'Internships', icon: Briefcase },
            ];
        }

        return [];
    };

    const navLinks = getNavLinks();

    return (
        <header className="sticky top-0 z-50 w-full bg-card-bg/95 backdrop-blur-md border-b border-ui-border">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* 1. LEFT: Branding & Logo */}
                    <div className="flex items-center space-x-3">
                        <Link to="/" className="flex items-center space-x-2.5 group">
                            <div className="bg-brand-primary/10 border border-brand-accent/20 p-2 rounded-xl text-brand-primary group-hover:scale-105 transition-transform">
                                <GraduationCap className="w-5 h-5 text-brand-accent" />
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <span className="font-heading font-extrabold text-lg text-text-main tracking-tight">
                                    CareerConnect
                                </span>
                                <span className="font-mono text-[9px] bg-slate-100 border border-ui-border text-brand-accent px-1.5 py-0.2 rounded font-semibold">
                                    CPUT
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* 2. CENTER: Clean Navigation Links */}
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
                                    <Icon className="w-3.5 h-3.5 opacity-70" />
                                    <span>{link.label}</span>
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* 3. RIGHT: Actions, Dedicated "+ Post Job" CTA & User Profile */}
                    <div className="hidden md:flex items-center space-x-3">

                        {/* 🌟 DEDICATED "+ Post Internship" BUTTON FOR EMPLOYERS */}
                        {user?.role === 'COMPANY' && (
                            <Link
                                to="/internships/new"
                                className="inline-flex items-center space-x-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                            >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>Post Internship</span>
                            </Link>
                        )}

                        {/* Search Shortcut */}
                        <button className="flex items-center space-x-2 bg-slate-50 border border-ui-border hover:border-brand-accent/40 text-text-muted hover:text-text-main px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer">
                            <Search className="w-3 h-3 text-brand-accent" />
                            <span className="text-[11px]">Search...</span>
                            <kbd className="font-mono bg-white text-[9px] text-text-muted border border-ui-border px-1 py-0.2 rounded">
                                Ctrl K
                            </kbd>
                        </button>

                        {/* User Profile / Guest State */}
                        {user ? (
                            <div className="flex items-center space-x-2.5 pl-2 border-l border-ui-border">
                                <button className="relative p-1.5 text-text-muted hover:text-text-main hover:bg-slate-50 border border-ui-border rounded-xl transition-colors cursor-pointer">
                                    <Bell className="w-3.5 h-3.5" />
                                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-mint rounded-full animate-pulse" />
                                </button>

                                <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                    {getInitials(user.name)}
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-bold text-text-main leading-none">
                                        {user.name}
                                    </span>
                                    <span className="font-mono text-[9px] font-semibold text-brand-mint bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded mt-0.5 w-fit leading-none">
                                        {user.role}
                                    </span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    title="Log Out"
                                    className="p-1.5 text-text-muted hover:text-rose-600 bg-card-bg hover:bg-rose-50 border border-ui-border hover:border-rose-200 rounded-xl transition-all cursor-pointer shadow-sm"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 pl-2 border-l border-ui-border">
                                <Link
                                    to="/login"
                                    className="text-xs font-medium text-text-muted hover:text-text-main px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    to="/signup"
                                    className="text-xs font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white px-3.5 py-1.5 rounded-xl shadow-sm transition-all hover:scale-[1.02]"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-text-muted hover:text-text-main border border-ui-border"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-ui-border space-y-2">
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

                        {user?.role === 'COMPANY' && (
                            <Link
                                to="/internships/new"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold bg-brand-primary text-white rounded-lg"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Post Internship</span>
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}