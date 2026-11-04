import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase, Search, MapPin, CalendarDays, Check, X, ChevronDown, ChevronUp, Undo2,
    Sparkles, Calendar, Clock, Banknote, FileCheck, ExternalLink, Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { getStudentApplications, withdrawApplication } from '../services/applicationService';
import {
    PageContainer, PageHeader, Card, Button, StatusBadge, Tabs, EmptyState, Skeleton, Alert, CompanyLogo,
    ConfirmDialog, cx,
} from '../components/ui';
import { STATUS_META, ACTIVE_STATUSES, formatDate, formatStipend, workModeLabel, errorMessage } from '../lib/format';

const STEPS = [
    { status: 'PENDING', label: 'Submitted' },
    { status: 'UNDER_REVIEW', label: 'Under review' },
    { status: 'SHORTLISTED', label: 'Shortlisted' },
    { status: 'ACCEPTED', label: 'Offer' },
];

const CLOSED_STATUSES = ['REJECTED', 'WITHDRAWN'];

const FILTERS = {
    ALL: () => true,
    ACTIVE: (a) => ACTIVE_STATUSES.includes(a.status),
    OFFERS: (a) => a.status === 'ACCEPTED',
    CLOSED: (a) => CLOSED_STATUSES.includes(a.status),
};

function ProgressTracker({ status }) {
    const closed = CLOSED_STATUSES.includes(status);
    const currentIndex = STEPS.findIndex((s) => s.status === status);

    if (closed) {
        const rejected = status === 'REJECTED';
        return (
            <div
                className={cx(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                    rejected ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-text-muted',
                )}
            >
                {rejected ? <X className="w-4 h-4 shrink-0" /> : <Undo2 className="w-4 h-4 shrink-0" />}
                <span className="font-medium">{STATUS_META[status].label}</span>
                <span className="text-text-muted hidden sm:inline">· This application is closed</span>
            </div>
        );
    }

    return (
        <ol className="flex items-center w-full" aria-label="Application progress">
            {STEPS.map((step, i) => {
                const done = i < currentIndex || (i === currentIndex && step.status === 'ACCEPTED');
                const current = i === currentIndex && !done;
                const reached = i <= currentIndex;
                return (
                    <li key={step.status} className={cx('flex items-center', i < STEPS.length - 1 && 'flex-1')}>
                        <div className="flex flex-col items-center gap-1.5 min-w-0">
                            <span
                                className={cx(
                                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2',
                                    done && (step.status === 'ACCEPTED' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-primary-600 border-primary-600 text-white'),
                                    current && 'bg-white border-primary-600 text-primary-700',
                                    !reached && 'bg-white border-slate-200 text-text-subtle',
                                )}
                            >
                                {done ? <Check className="w-4 h-4" /> : i + 1}
                            </span>
                            <span
                                className={cx(
                                    'text-xs whitespace-nowrap',
                                    reached ? 'text-text-main font-medium' : 'text-text-subtle',
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={cx('h-0.5 flex-1 mx-2 mb-5 rounded-full', i < currentIndex ? 'bg-primary-600' : 'bg-slate-200')} />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

function OfferReceivedCard({ app }) {
    const internship = app.internship ?? {};
    const mode = workModeLabel(internship.workMode);
    const stipend = formatStipend(internship.stipend);

    return (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1">
                        Placement Offer
                    </div>
                    <h4 className="text-base font-bold text-emerald-950">
                        Official Internship Offer Received!
                    </h4>
                    <p className="text-sm text-emerald-800 mt-0.5">
                        Congratulations! <strong className="font-semibold text-emerald-900">{internship.companyName || 'The employer'}</strong> has selected you for this internship.
                    </p>
                </div>
            </div>

            {/* Offer Key Logistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-emerald-200/80 text-sm">
                <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-200/70">
                    <span className="text-xs text-emerald-700 block font-medium">Proposed Start Date</span>
                    <span className="font-semibold text-text-main flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {internship.startDate ? formatDate(internship.startDate) : 'To be confirmed'}
                    </span>
                </div>
                <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-200/70">
                    <span className="text-xs text-emerald-700 block font-medium">Monthly Stipend</span>
                    <span className="font-semibold text-text-main flex items-center gap-1.5 mt-0.5">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {stipend ?? 'Disclosed in contract'}
                    </span>
                </div>
                <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-200/70">
                    <span className="text-xs text-emerald-700 block font-medium">Duration & Mode</span>
                    <span className="font-semibold text-text-main flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {internship.durationMonths ? `${internship.durationMonths} months` : 'Fixed-term'}
                        {mode ? ` · ${mode}` : ''}
                    </span>
                </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="rounded-lg bg-white/95 border border-emerald-200/80 p-3.5 space-y-2 text-xs sm:text-sm">
                <p className="font-semibold text-emerald-950 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    What you should do next:
                </p>
                <ul className="space-y-1.5 text-text-muted pl-1">
                    <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <span><strong className="text-text-main font-medium">Check your student email:</strong> The employer will reach out with your formal offer letter, contract, or onboarding paperwork.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <span><strong className="text-text-main font-medium">Submit CPUT WIL Documentation:</strong> Share the job description and company details with your CPUT departmental WIL coordinator for internship course credit.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <span><strong className="text-text-main font-medium">Manage other applications:</strong> Once you confirm this placement, consider withdrawing other active applications so fellow classmates can be considered.</span>
                    </li>
                </ul>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                    to={`/internships/${internship.internshipId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
                >
                    View Role Description
                    <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                {internship.companyName && (
                    <Link
                        to="/companies"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50 transition"
                    >
                        <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                        Company Directory
                    </Link>
                )}
            </div>
        </div>
    );
}

function ApplicationRow({ app, onWithdraw }) {
    const [expanded, setExpanded] = useState(false);
    const internship = app.internship ?? {};
    const mode = workModeLabel(internship.workMode);
    const canWithdraw = ACTIVE_STATUSES.includes(app.status);
    const hasCoverLetter = Boolean(app.coverLetter?.trim());

    return (
        <Card>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <CompanyLogo name={internship.companyName} />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                            <Link
                                to={`/internships/${internship.internshipId}`}
                                className="text-base font-semibold text-text-main hover:text-primary-700"
                            >
                                {internship.title ?? 'Internship'}
                            </Link>
                            <p className="text-sm text-text-muted">{internship.companyName}</p>
                        </div>
                        <StatusBadge status={app.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                        {internship.location && (
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {internship.location}{mode && ` · ${mode}`}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4" />
                            Applied {formatDate(app.dateApplied)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <ProgressTracker status={app.status} />
                {app.status === 'ACCEPTED' ? (
                    <OfferReceivedCard app={app} />
                ) : (
                    STATUS_META[app.status]?.description && (
                        <p className="mt-3 text-sm text-text-muted">{STATUS_META[app.status].description}.</p>
                    )
                )}
            </div>

            {(hasCoverLetter || canWithdraw) && (
                <div className="mt-4 pt-4 border-t border-ui-border flex flex-wrap items-center justify-between gap-2">
                    {hasCoverLetter ? (
                        <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {expanded ? 'Hide cover letter' : 'View cover letter'}
                        </Button>
                    ) : <span />}
                    {canWithdraw && (
                        <Button variant="danger-outline" size="sm" onClick={() => onWithdraw(app)}>
                            Withdraw
                        </Button>
                    )}
                </div>
            )}

            {expanded && hasCoverLetter && (
                <div className="mt-3 rounded-lg bg-slate-50 border border-ui-border p-4 text-sm text-text-main whitespace-pre-line leading-relaxed">
                    {app.coverLetter}
                </div>
            )}
        </Card>
    );
}

export default function StudentApplicationsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const studentNumber = user?.id;

    const [applications, setApplications] = useState(null);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [toWithdraw, setToWithdraw] = useState(null);
    const [withdrawing, setWithdrawing] = useState(false);

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!studentNumber) return undefined;
        let cancelled = false;
        getStudentApplications(studentNumber)
            .then((data) => {
                if (!cancelled) setApplications([...(data ?? [])].sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied)));
            })
            .catch((err) => {
                if (!cancelled) setError(errorMessage(err, 'Could not load your applications.'));
            });
        return () => { cancelled = true; };
    }, [studentNumber, reloadKey]);

    const retry = () => {
        setError(null);
        setApplications(null);
        setReloadKey((k) => k + 1);
    };

    const counts = useMemo(() => {
        const list = applications ?? [];
        return Object.fromEntries(Object.entries(FILTERS).map(([key, fn]) => [key, list.filter(fn).length]));
    }, [applications]);

    const visible = useMemo(() => (applications ?? []).filter(FILTERS[filter]), [applications, filter]);

    const confirmWithdraw = async () => {
        if (!toWithdraw) return;
        setWithdrawing(true);
        try {
            const updated = await withdrawApplication(toWithdraw.applicationId);
            setApplications((list) => list.map((a) => (
                a.applicationId === toWithdraw.applicationId
                    ? { ...a, status: 'WITHDRAWN', updatedAt: updated?.updatedAt ?? a.updatedAt }
                    : a
            )));
            toast('Application withdrawn', 'success');
            setToWithdraw(null);
        } catch (err) {
            toast(errorMessage(err, 'Could not withdraw the application.'), 'error');
        } finally {
            setWithdrawing(false);
        }
    };

    const tabs = [
        { value: 'ALL', label: 'All', count: counts.ALL },
        { value: 'ACTIVE', label: 'Active', count: counts.ACTIVE },
        { value: 'OFFERS', label: 'Offers', count: counts.OFFERS },
        { value: 'CLOSED', label: 'Closed', count: counts.CLOSED },
    ];

    return (
        <PageContainer className="max-w-5xl">
            <PageHeader
                title="My applications"
                subtitle="Track the progress of every internship you have applied for."
                actions={<Button to="/internships" variant="secondary" icon={Search}>Browse internships</Button>}
            />

            {error ? (
                <Alert title="Something went wrong">
                    <p>{error}</p>
                    <Button variant="secondary" size="sm" className="mt-3" onClick={retry}>Try again</Button>
                </Alert>
            ) : applications === null ? (
                <div className="space-y-4">
                    {[0, 1, 2].map((i) => <Skeleton key={i} className="h-44 w-full rounded-xl" />)}
                </div>
            ) : applications.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={Briefcase}
                        title="You have not applied for any internships yet"
                        description="Browse open opportunities from companies hiring CPUT students and apply in minutes."
                        action={<Button to="/internships" icon={Search}>Find internships</Button>}
                    />
                </Card>
            ) : (
                <>
                    <Tabs tabs={tabs} value={filter} onChange={setFilter} className="mb-6" />
                    {visible.length === 0 ? (
                        <Card>
                            <EmptyState
                                icon={Briefcase}
                                title="Nothing here yet"
                                description="No applications match this filter."
                            />
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {visible.map((app) => (
                                <ApplicationRow key={app.applicationId} app={app} onWithdraw={setToWithdraw} />
                            ))}
                        </div>
                    )}
                </>
            )}

            <ConfirmDialog
                open={Boolean(toWithdraw)}
                onClose={() => !withdrawing && setToWithdraw(null)}
                onConfirm={confirmWithdraw}
                loading={withdrawing}
                title="Withdraw application?"
                message={`You are about to withdraw your application for ${toWithdraw?.internship?.title ?? 'this internship'}${toWithdraw?.internship?.companyName ? ` at ${toWithdraw.internship.companyName}` : ''}. This cannot be undone.`}
                confirmLabel="Withdraw"
            />
        </PageContainer>
    );
}
