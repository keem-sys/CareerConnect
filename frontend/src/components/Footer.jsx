import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, Building2, User, LogOut, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <footer className="border-t border-ui-border bg-white mt-20 sm:mt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                {/* Main 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-8 mb-10">
                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-3">
                        <Link to="/" className="inline-flex items-center gap-2 group">
                            <span className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors">
                                <GraduationCap className="w-5 h-5" />
                            </span>
                            <span className="font-heading font-bold text-lg text-text-main">CareerConnect</span>
                        </Link>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Connecting CPUT students with verified industry internships and graduate work-integrated learning opportunities.
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                            <span>CPUT Capstone Project</span>
                        </div>
                    </div>

                    {/* Students Column */}
                    <nav aria-label="Student links" className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
                            For Students
                        </h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            <li>
                                <Link to="/internships" className="hover:text-text-main transition-colors inline-flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5 text-text-subtle" />
                                    Browse Internships
                                </Link>
                            </li>
                            <li>
                                <Link to="/companies" className="hover:text-text-main transition-colors inline-flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-text-subtle" />
                                    Hiring Companies
                                </Link>
                            </li>
                            {user?.role === 'STUDENT' ? (
                                <>
                                    <li>
                                        <Link to="/applications" className="hover:text-text-main transition-colors">
                                            My Applications
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/profile" className="hover:text-text-main transition-colors">
                                            Student Profile
                                        </Link>
                                    </li>
                                </>
                            ) : !user && (
                                <li>
                                    <Link to="/signup" className="hover:text-text-main transition-colors">
                                        Create Student Profile
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>

                    {/* Employers Column */}
                    <nav aria-label="Employer links" className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
                            For Employers
                        </h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            {user?.role === 'COMPANY' ? (
                                <>
                                    <li>
                                        <Link to="/internships/new" className="hover:text-text-main transition-colors">
                                            Post an Internship
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/company/postings" className="hover:text-text-main transition-colors">
                                            Manage Postings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/company/applicants" className="hover:text-text-main transition-colors">
                                            Review Applicants
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/company/profile" className="hover:text-text-main transition-colors">
                                            Company Profile
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to={user ? "/internships" : "/login"} className="hover:text-text-main transition-colors">
                                            Post an Internship
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/companies" className="hover:text-text-main transition-colors">
                                            Employer Directory
                                        </Link>
                                    </li>
                                    {!user && (
                                        <li>
                                            <Link to="/signup" className="hover:text-text-main transition-colors">
                                                Employer Registration
                                            </Link>
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>
                    </nav>

                    {/* Account & Administration Column */}
                    <nav aria-label="Account links" className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
                            {user ? 'My Account' : 'Get Started'}
                        </h3>
                        <ul className="space-y-2 text-sm text-text-muted">
                            {user ? (
                                <>
                                    <li className="text-xs text-text-subtle truncate max-w-full">
                                        Signed in as <span className="font-medium text-text-main">{user.name || user.email}</span>
                                    </li>
                                    <li>
                                        <Link to="/" className="hover:text-text-main transition-colors inline-flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-text-subtle" />
                                            Dashboard
                                        </Link>
                                    </li>
                                    {user.role === 'ADMIN' && (
                                        <>
                                            <li>
                                                <Link to="/admin/students" className="hover:text-text-main transition-colors">
                                                    Manage Students
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/admin/companies" className="hover:text-text-main transition-colors">
                                                    Manage Companies
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/admin/internships" className="hover:text-text-main transition-colors">
                                                    Manage Internships
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    <li>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="hover:text-rose-600 transition-colors inline-flex items-center gap-1.5 cursor-pointer text-left"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Sign Out
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/login" className="hover:text-text-main transition-colors">
                                            Sign In
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/signup"
                                            className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700 transition-colors"
                                        >
                                            Create Account
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>

                {/* Bottom Bar / Copyright */}
                <div className="pt-6 border-t border-ui-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-subtle">
                    <p>© {new Date().getFullYear()} CareerConnect. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Cape Peninsula University of Technology · Application Development Capstone
                    </p>
                </div>
            </div>
        </footer>
    );
}

