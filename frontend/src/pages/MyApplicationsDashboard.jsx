import { useEffect, useMemo, useState } from 'react';
import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    GraduationCap,
    RefreshCw,
    Search,
    XCircle,
} from 'lucide-react';

import { getApplicationsByStudent } from '../services/applicationService';

const STATUS_CONFIG = {
    Pending: {
        label: 'Pending',
        icon: Clock3,
        className: 'bg-amber-50 text-brand-warning border-amber-200',
    },
    Accepted: {
        label: 'Accepted',
        icon: CheckCircle2,
        className: 'bg-emerald-50 text-brand-mint border-emerald-200',
    },
    Rejected: {
        label: 'Rejected',
        icon: XCircle,
        className: 'bg-rose-50 text-rose-600 border-rose-200',
    },
};

function getStatusConfig(status) {
    return (
        STATUS_CONFIG[status] || {
            label: status || 'Unknown',
            icon: Clock3,
            className: 'bg-slate-50 text-text-muted border-ui-border',
        }
    );
}

function formatDate(value) {
    if (!value) {
        return 'N/A';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function getInternshipTitle(application) {
    return (
        application?.internship?.title ||
        application?.internship?.internshipTitle ||
        application?.internship?.name ||
        'Internship Opportunity'
    );
}

function getCompanyName(application) {
    return (
        application?.internship?.companyName ||
        application?.internship?.company?.name ||
        application?.internship?.company ||
        'Company'
    );
}

function getApplicationId(application) {
    return application?.applicationId || 'N/A';
}

export default function MyApplicationsDashboard({ studentId }) {
    const [applications, setApplications] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadApplications = async () => {
        if (!studentId) {
            setApplications([]);
            setError('No student number was provided.');
            setIsLoading(false);
            return;
        }

        try {
            setError('');
            setIsLoading(true);

            const data = await getApplicationsByStudent(studentId);

            setApplications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load applications:', err);

            setApplications([]);

            setError(
                err?.response?.data ||
                'Could not load your applications. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, [studentId]);

    const counts = useMemo(() => {
        return {
            All: applications.length,

            Pending: applications.filter(
                (application) => application?.status === 'Pending'
            ).length,

            Accepted: applications.filter(
                (application) => application?.status === 'Accepted'
            ).length,

            Rejected: applications.filter(
                (application) => application?.status === 'Rejected'
            ).length,
        };
    }, [applications]);

    const filteredApplications = useMemo(() => {
        let result = applications;

        if (activeFilter !== 'All') {
            result = result.filter(
                (application) => application?.status === activeFilter
            );
        }

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();

            result = result.filter((application) => {
                const title = getInternshipTitle(application).toLowerCase();
                const company = getCompanyName(application).toLowerCase();
                const id = getApplicationId(application).toLowerCase();

                return (
                    title.includes(search) ||
                    company.includes(search) ||
                    id.includes(search)
                );
            });
        }

        return result;
    }, [applications, activeFilter, searchTerm]);

    return (
        <main className="min-h-screen bg-app-bg">
            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}
            <section className="mx-auto max-w-7xl px-6 py-8">
                {/* Page heading */}
                <div className="mb-8 flex flex-col gap-5 border-b border-ui-border pb-7 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-brand-accent">
                            <BriefcaseBusiness size={20} />

                            <span className="text-sm font-semibold">
                                Student Portal
                            </span>
                        </div>

                        <h2 className="font-heading text-3xl font-bold tracking-tight text-text-main">
                            My Applications
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                            Track the internships you have applied for and
                            monitor the status of each application.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadApplications}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={isLoading ? 'animate-spin' : ''}
                        />

                        {isLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {/* =====================================================
                    STUDENT INFORMATION
                ===================================================== */}
                <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_auto]">
                    <div className="rounded-2xl border border-ui-border bg-card-bg p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-brand-accent">
                                <GraduationCap size={24} />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
                                    Student Number
                                </p>

                                <p className="mt-1 font-mono text-lg font-semibold text-text-main">
                                    {studentId || 'Not available'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-ui-border bg-card-bg px-6 py-5 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-brand-accent">
                                <FileText size={21} />
                            </div>

                            <div>
                                <p className="text-xs text-text-muted">
                                    Total Applications
                                </p>

                                <p className="font-heading text-2xl font-bold text-text-main">
                                    {counts.All}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    STATISTICS
                ===================================================== */}
                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        {
                            name: 'All',
                            label: 'All Applications',
                            icon: FileText,
                        },
                        {
                            name: 'Pending',
                            label: 'Pending',
                            icon: Clock3,
                        },
                        {
                            name: 'Accepted',
                            label: 'Accepted',
                            icon: CheckCircle2,
                        },
                        {
                            name: 'Rejected',
                            label: 'Rejected',
                            icon: XCircle,
                        },
                    ].map((item) => {
                        const Icon = item.icon;
                        const active = activeFilter === item.name;

                        return (
                            <button
                                key={item.name}
                                type="button"
                                onClick={() => setActiveFilter(item.name)}
                                className={`group rounded-2xl border p-5 text-left shadow-sm transition ${
                                    active
                                        ? 'border-brand-primary bg-brand-primary text-white'
                                        : 'border-ui-border bg-card-bg text-text-main hover:bg-card-hover'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                            active
                                                ? 'bg-white/10'
                                                : 'bg-sky-50 text-brand-accent'
                                        }`}
                                    >
                                        <Icon size={19} />
                                    </div>

                                    <span
                                        className={`font-heading text-2xl font-bold ${
                                            active
                                                ? 'text-white'
                                                : 'text-text-main'
                                        }`}
                                    >
                                        {counts[item.name]}
                                    </span>
                                </div>

                                <p
                                    className={`mt-4 text-xs font-semibold ${
                                        active
                                            ? 'text-white/80'
                                            : 'text-text-muted'
                                    }`}
                                >
                                    {item.label}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* =====================================================
                    ERROR
                ===================================================== */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
                        <div className="flex items-start gap-3">
                            <XCircle
                                size={21}
                                className="mt-0.5 shrink-0 text-rose-600"
                            />

                            <div>
                                <h3 className="font-heading font-semibold text-rose-700">
                                    Unable to load applications
                                </h3>

                                <p className="mt-1 text-sm text-rose-600">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={loadApplications}
                                    className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-50"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* =====================================================
                    APPLICATION DIRECTORY
                ===================================================== */}
                <div className="overflow-hidden rounded-2xl border border-ui-border bg-card-bg shadow-sm">
                    {/* Directory heading */}
                    <div className="border-b border-ui-border px-6 py-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h3 className="font-heading text-lg font-bold text-text-main">
                                    Application Directory
                                </h3>

                                <p className="mt-1 text-xs text-text-muted">
                                    Your internship applications and their
                                    current status.
                                </p>
                            </div>

                            {/* Search */}
                            <div className="relative w-full lg:w-72">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle"
                                />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search applications..."
                                    className="w-full rounded-xl border border-ui-border bg-app-bg py-2.5 pl-10 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-subtle focus:border-brand-accent focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="px-6 py-16 text-center">
                            <RefreshCw
                                size={30}
                                className="mx-auto animate-spin text-brand-accent"
                            />

                            <p className="mt-4 text-sm text-text-muted">
                                Loading your applications...
                            </p>
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading &&
                        !error &&
                        filteredApplications.length === 0 && (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                                    <FileText
                                        size={25}
                                        className="text-text-muted"
                                    />
                                </div>

                                <h3 className="mt-5 font-heading text-lg font-bold text-text-main">
                                    No applications found
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
                                    {searchTerm
                                        ? 'No applications match your search.'
                                        : activeFilter === 'All'
                                            ? 'You have not submitted any internship applications yet.'
                                            : `You do not have any ${activeFilter.toLowerCase()} applications.`}
                                </p>
                            </div>
                        )}

                    {/* =================================================
                        TABLE
                    ================================================= */}
                    {!isLoading &&
                        !error &&
                        filteredApplications.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] border-collapse">
                                    <thead>
                                    <tr className="bg-app-bg">
                                        <th className="px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                                            Internship
                                        </th>

                                        <th className="px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                                            Company
                                        </th>

                                        <th className="px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                                            Application ID
                                        </th>

                                        <th className="px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                                            Date Applied
                                        </th>

                                        <th className="px-6 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                                            Status
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody className="divide-y divide-ui-border">
                                    {filteredApplications.map(
                                        (application) => {
                                            const status =
                                                application?.status ||
                                                'Pending';

                                            const statusConfig =
                                                getStatusConfig(status);

                                            const StatusIcon =
                                                statusConfig.icon;

                                            const applicationId =
                                                getApplicationId(
                                                    application
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        applicationId !==
                                                        'N/A'
                                                            ? applicationId
                                                            : `${application?.student?.studentNumber}-${application?.internship?.internshipId}`
                                                    }
                                                    className="transition hover:bg-card-hover"
                                                >
                                                    {/* Internship */}
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-brand-accent">
                                                                <BriefcaseBusiness
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            </div>

                                                            <div>
                                                                <p className="font-heading text-sm font-bold text-text-main">
                                                                    {getInternshipTitle(
                                                                        application
                                                                    )}
                                                                </p>

                                                                <p className="mt-1 font-mono text-[10px] text-text-subtle">
                                                                    {application
                                                                            ?.internship
                                                                            ?.internshipId ||
                                                                        'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Company */}
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm font-medium text-text-main">
                                                            {getCompanyName(
                                                                application
                                                            )}
                                                        </p>
                                                    </td>

                                                    {/* Application ID */}
                                                    <td className="px-6 py-5">
                                                            <span className="font-mono text-xs font-medium text-brand-accent">
                                                                {
                                                                    applicationId
                                                                }
                                                            </span>
                                                    </td>

                                                    {/* Date */}
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm text-text-muted">
                                                            {formatDate(
                                                                application?.dateApplied
                                                            )}
                                                        </p>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-5">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusConfig.className}`}
                                                            >
                                                                <StatusIcon
                                                                    size={14}
                                                                />

                                                                {
                                                                    statusConfig.label
                                                                }
                                                            </span>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </div>

                {/* Footer information */}
                <div className="mt-5 flex items-center justify-between text-xs text-text-subtle">
                    <p>
                        Showing{' '}
                        <span className="font-semibold text-text-muted">
                            {filteredApplications.length}
                        </span>{' '}
                        application
                        {filteredApplications.length === 1 ? '' : 's'}
                    </p>

                    <p className="hidden sm:block">
                        CareerConnect Student Portal
                    </p>
                </div>
            </section>
        </main>
    );
}