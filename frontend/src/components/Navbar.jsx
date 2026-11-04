import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Menu, X, LogOut, Plus, ChevronDown, User, FileText, LayoutDashboard } from 'lucide-react';
import { Avatar, Button, cx } from './ui';

const LINKS = {
    GUEST: [
        { to: '/internships', label: 'Find internships' },
        { to: '/companies', label: 'Companies' },
    ],
    STUDENT: [
        { to: '/', label: 'Dashboard', end: true },
        { to: '/internships', label: 'Find internships' },
        { to: '/applications', label: 'My applications' },
        { to: '/companies', label: 'Companies' },
    ],
    COMPANY: [
        { to: '/', label: 'Dashboard', end: true },
        { to: '/company/postings', label: 'My postings' },
        { to: '/company/applicants', label: 'Applicants' },
    ],
    ADMIN: [
        { to: '/', label: 'Overview', end: true },
        { to: '/admin/students', label: 'Students' },
        { to: '/admin/companies', label: 'Companies' },
        { to: '/admin/internships', label: 'Internships' },
    ],
};

const ROLE_LABEL = { STUDENT: 'Student', COMPANY: 'Employer', ADMIN: 'Administrator' };

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [lastPath, setLastPath] = useState(location.pathname);
    const menuRef = useRef(null);

    const links = LINKS[user?.role] ?? LINKS.GUEST;

    if (lastPath !== location.pathname) {
        setLastPath(location.pathname);
        setMobileOpen(false);
        setMenuOpen(false);
    }

    useEffect(() => {
        const onClick = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const linkClass = ({ isActive }) =>
        cx(
            'relative px-3 py-2 text-sm font-medium transition-colors rounded-md',
            isActive ? 'text-primary-700' : 'text-text-muted hover:text-text-main hover:bg-slate-50',
        );

    const menuItems = user?.role === 'STUDENT'
        ? [{ to: '/profile', label: 'My profile', icon: User }, { to: '/applications', label: 'My applications', icon: FileText }]
        : user?.role === 'COMPANY'
            ? [{ to: '/company/profile', label: 'Company profile', icon: User }, { to: '/company/postings', label: 'My postings', icon: FileText }]
            : [{ to: '/', label: 'Overview', icon: LayoutDashboard }];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-ui-border">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <span className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                            <GraduationCap className="w-5 h-5" />
                        </span>
                        <span className="text-lg font-bold tracking-tight">Career<span className="text-primary-600">Connect</span></span>
                    </Link>
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((l) => (
                            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                                {({ isActive }) => (
                                    <>
                                        {l.label}
                                        {isActive && <span className="absolute left-3 right-3 -bottom-[13px] h-0.5 bg-primary-600 rounded-full" />}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    {user?.role === 'COMPANY' && (
                        <Button to="/internships/new" size="sm" icon={Plus}>Post internship</Button>
                    )}
                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((o) => !o)}
                                className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-slate-50 cursor-pointer"
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                            >
                                <Avatar name={user.name} size="sm" />
                                <span className="text-sm font-medium max-w-[140px] truncate">{user.name}</span>
                                <ChevronDown className="w-4 h-4 text-text-subtle" />
                            </button>
                            {menuOpen && (
                                <div role="menu" className="absolute right-0 mt-2 w-60 bg-white border border-ui-border rounded-lg shadow-(--shadow-pop) py-1 animate-fade-in">
                                    <div className="px-4 py-3 border-b border-ui-border">
                                        <p className="text-sm font-semibold truncate">{user.name}</p>
                                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                                        <p className="text-xs text-primary-700 font-medium mt-1">{ROLE_LABEL[user.role]}</p>
                                    </div>
                                    {menuItems.map((m) => (
                                        <Link key={m.to} to={m.to} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50">
                                            <m.icon className="w-4 h-4 text-text-subtle" />{m.label}
                                        </Link>
                                    ))}
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 border-t border-ui-border mt-1 cursor-pointer">
                                        <LogOut className="w-4 h-4" />Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Button to="/login" variant="ghost" size="sm">Sign in</Button>
                            <Button to="/signup" size="sm">Create account</Button>
                        </>
                    )}
                </div>

                <button onClick={() => setMobileOpen((o) => !o)} className="md:hidden p-2 rounded-md text-text-muted hover:bg-slate-100 cursor-pointer" aria-label="Menu">
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </nav>

            {mobileOpen && (
                <div className="md:hidden border-t border-ui-border bg-white px-4 py-3 space-y-1">
                    {links.map((l) => (
                        <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => cx('block px-3 py-2 rounded-md text-sm font-medium', isActive ? 'bg-primary-50 text-primary-700' : 'text-text-muted')}>
                            {l.label}
                        </NavLink>
                    ))}
                    {user?.role === 'COMPANY' && <Link to="/internships/new" className="block px-3 py-2 rounded-md text-sm font-medium text-primary-700">+ Post internship</Link>}
                    <div className="pt-2 mt-2 border-t border-ui-border">
                        {user ? (
                            <>
                                {menuItems.map((m) => <Link key={m.to} to={m.to} className="block px-3 py-2 text-sm text-text-muted">{m.label}</Link>)}
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-rose-600 cursor-pointer">Sign out</button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Button to="/login" variant="secondary" className="flex-1">Sign in</Button>
                                <Button to="/signup" className="flex-1">Create account</Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
