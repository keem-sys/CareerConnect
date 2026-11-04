import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    GraduationCap,
    RefreshCw,
    Search,
    XCircle,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStudentApplications } from '../services/applicationService';

function normalizeStatus(status) {
    const s = status?.toUpperCase() || 'PENDING';
    if (s === 'ACCEPTED' || s === 'APPROVED') return 'Accepted';
    if (s === 'REJECTED' || s === 'DECLINED') return 'Rejected';
    return 'Pending';
}

const STATUS_CONFIG = {
    Pending: {
        label: 'Pending Review',
        icon: Clock3,
        className: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    Accepted: {
        label: 'Approved / Shortlisted',
        icon: CheckCircle2,
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    Rejected: {
        label: 'Not Selected',
        icon: XCircle,
        className: 'bg-rose-50 text-rose-700 border-rose-200',
    },
};

function formatDate(value) {
    if (!value) return 'Recent';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function StudentApplicationsPage() {
    const { user } = useAuth();
    const studentNumber = user?.studentNumber || user?.id;

    const [applications, setApplications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadApplications = async () => {
        if (!studentNumber) {
            setApplications([]);
            setError('Please sign in with your CPUT student account.');
            setIsLoading(false);
            return;
        }

        try {
            setError('');
            setIsLoading(true);
            const data = await getStudentApplications(studentNumber);
            setApplications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load applications:', err);
            setApplications([]);
            setError(typeof err === 'string' ? err : 'Could not load your applications from server.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, [studentNumber]);

    const counts = useMemo(() => {
        return {
            All: applications.length,
            Pending: applications.filter((app) => normalizeStatus(app?.status) === 'Pending').length,
            Accepted: applications.filter((app) => normalizeStatus(app?.status) === 'Accepted').length,
            Rejected: applications.filter((app) => normalizeStatus(app?.status) === 'Rejected').length,
        };
    }, [applications]);

    const filteredApplications = useMemo(() => {
        let result = applications;

        if (activeFilter !== 'All') {
            result = result.filter((app) => normalizeStatus(app?.status) === activeFilter);
        }

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            result = result.filter((app) => {
                const title = (app?.internship?.title || '').toLowerCase();
                const location = (app?.internship?.location || '').toLowerCase();
                const id = (app?.applicationId || '').toLowerCase();
                return title.includes(search) || location.includes(search) || id.includes(search);
            });
        }

        return result;
    }, [applications, activeFilter, searchTerm]);

    return (
        <main className="min-h-[calc(100vh-5rem)] bg-app-bg">
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Heading */}
                <div className="flex flex-col gap-4 border-b border-ui-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-accent/20 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-semibold">
                            <BriefcaseBusiness size={14} />
                            <span>CPUT WIL Tracker</span>
                        </div>
                        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-text-main">
                            My Submitted Applications
                        </h1>
                        <p className="mt-1 text-xs text-text-muted">
                            Track the real-time status of your Work-Integrated Learning (WIL) internship applications.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={loadApplications}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-card-bg border border-ui-border px-4 py-2 text-xs font-semibold text-text-main hover:bg-slate-50 transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                        >
                            <RefreshCw size={14} className={isLoading ? 'animate-spin text-brand-accent' : ''} />
                            <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                        </button>

                        <Link
                            to="/internships"
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:scale-[1.02]"
                        >
                            <span>Browse Jobs</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Student Info Bar */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-ui-border bg-card-bg p-5 shadow-xs flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-brand-accent">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-subtle">
                                Student ID
                            </p>
                            <p className="font-mono text-base font-bold text-text-main mt-0.5">
                                {studentNumber || 'Not available'}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-ui-border bg-card-bg p-5 shadow-xs flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-brand-accent">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-subtle">
                                Total Submissions
                            </p>
                            <p className="font-heading text-xl font-bold text-text-main mt-0.5">
                                {counts.All} Placements Applied
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Status Metrics */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        { name: 'All', label: 'All Applications', icon: FileText, color: 'text-text-main' },
                        { name: 'Pending', label: 'Pending Review', icon: Clock3, color: 'text-amber-600' },
                        { name: 'Accepted', label: 'Accepted / Shortlisted', icon: CheckCircle2, color: 'text-brand-mint' },
                        { name: 'Rejected', label: 'Not Selected', icon: XCircle, color: 'text-rose-600' },
                    ].map((item) => {
                        const Icon = item.icon;
                        const active = activeFilter === item.name;

                        return (
                            <button
                                key={item.name}
                                type="button"
                                onClick={() => setActiveFilter(item.name)}
                                className={`rounded-2xl border p-4 text-left shadow-xs transition-all cursor-pointer ${
                                    active
                                        ? 'border-brand-primary bg-brand-primary text-white shadow-md'
                                        : 'border-ui-border bg-card-bg text-text-main hover:bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`p-2 rounded-xl ${active ? 'bg-white/10 text-white' : 'bg-slate-100 text-brand-accent'}`}>
                                        <Icon size={18} />
                                    </div>
                                    <span className={`font-heading text-xl font-bold ${active ? 'text-white' : item.color}`}>
                                        {counts[item.name]}
                                    </span>
                                </div>
                                <p className={`mt-3 text-xs font-semibold ${active ? 'text-white/80' : 'text-text-muted'}`}>
                                    {item.label}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Directory Container */}
                <div className="overflow-hidden rounded-2xl border border-ui-border bg-card-bg shadow-xs">

                    {/* Filter / Search Bar */}
                    <div className="border-b border-ui-border px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-heading text-sm font-bold text-text-main">
                                Applications Log
                            </h3>
                            <p className="text-[11px] text-text-muted">
                                Real-time response decisions updated by prospective employers.
                            </p>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by role or location..."
                                className="w-full rounded-xl border border-ui-border bg-app-bg py-2 pl-9 pr-4 text-xs text-text-main outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="py-16 text-center space-y-2">
                            <RefreshCw size={24} className="mx-auto animate-spin text-brand-accent" />
                            <p className="text-xs text-text-muted">Loading your records...</p>
                        </div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="py-16 text-center space-y-3">
                            <FileText size={32} className="mx-auto text-text-subtle opacity-40" />
                            <h3 className="font-heading font-bold text-text-main text-sm">No applications found</h3>
                            <p className="text-xs text-text-muted max-w-sm mx-auto">
                                {searchTerm
                                    ? 'No records match your search criteria.'
                                    : activeFilter === 'All'
                                        ? "You haven't submitted any internship applications yet."
                                        : `You do not have any ${activeFilter.toLowerCase()} applications.`}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-text-main">
                                <thead>
                                <tr className="bg-app-bg font-mono uppercase text-[10px] text-text-muted border-b border-ui-border">
                                    <th className="px-6 py-3.5">Position & Role</th>
                                    <th className="px-6 py-3.5">Location</th>
                                    <th className="px-6 py-3.5">Reference ID</th>
                                    <th className="px-6 py-3.5">Date Submitted</th>
                                    <th className="px-6 py-3.5">Employer Decision</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-ui-border">
                                {filteredApplications.map((app) => {
                                    const norm = normalizeStatus(app?.status);
                                    const config = STATUS_CONFIG[norm];
                                    const Icon = config.icon;

                                    return (
                                        <tr key={app.applicationId} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-text-main text-sm">
                                                    {app.internship?.title || 'Internship Position'}
                                                </div>
                                                <div className="text-[10px] font-mono text-text-muted mt-0.5">
                                                    CID: {app.internship?.companyId || 'N/A'}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-text-muted">
                                                {app.internship?.location || 'Remote / Western Cape'}
                                            </td>

                                            <td className="px-6 py-4 font-mono text-brand-accent">
                                                {app.applicationId}
                                            </td>

                                            <td className="px-6 py-4 font-mono text-text-muted">
                                                {formatDate(app.dateApplied)}
                                            </td>

                                            <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
                                                        <Icon size={13} />
                                                        <span>{config.label}</span>
                                                    </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </section>
        </main>
    );
}