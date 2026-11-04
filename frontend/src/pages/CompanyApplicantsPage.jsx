import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, ExternalLink, Mail, Search, Star, Users, XCircle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCompanyApplications, updateApplicationStatus } from '../services/applicationService';
import { getInternshipsByCompany } from '../services/internshipService';
import { getProfileByStudentNumber } from '../services/profileService';
import { useToast } from '../components/ui/Toast';
import {
    Alert, Avatar, Badge, Button, Card, ConfirmDialog, EmptyState, Input, Modal, PageContainer, PageHeader,
    Select, Skeleton, Spinner, StatusBadge, Tabs,
} from '../components/ui';
import { APPLICATION_STATUSES, NEXT_STATUSES, STATUS_META, errorMessage, formatDate, timeAgo } from '../lib/format';

const ACTIONS = {
    UNDER_REVIEW: { label: 'Move to review', variant: 'secondary', icon: Eye },
    SHORTLISTED: { label: 'Shortlist', variant: 'primary', icon: Star },
    ACCEPTED: { label: 'Make offer', variant: 'success', icon: CheckCircle2, confirm: true },
    REJECTED: { label: 'Reject', variant: 'danger-outline', icon: XCircle, confirm: true },
};

const CONFIRM_COPY = {
    ACCEPTED: (name) => ({
        title: 'Make an offer?',
        message: `${name} will be notified that they received an offer. This cannot be undone.`,
        confirmLabel: 'Make offer',
        variant: 'success',
    }),
    REJECTED: (name) => ({
        title: 'Reject this applicant?',
        message: `${name} will see their application as "Not selected". This cannot be undone.`,
        confirmLabel: 'Reject',
        variant: 'danger',
    }),
};

function ApplicantDetails({ application, onChangeStatus, updating }) {
    const studentNumber = application.student?.studentNumber;
    const [profile, setProfile] = useState(null);
    const [profileState, setProfileState] = useState(studentNumber ? 'loading' : 'missing');

    useEffect(() => {
        let cancelled = false;
        if (!studentNumber) return undefined;
        getProfileByStudentNumber(studentNumber)
            .then((p) => { if (!cancelled) { setProfile(p); setProfileState('ready'); } })
            .catch(() => { if (!cancelled) setProfileState('missing'); });
        return () => { cancelled = true; };
    }, [studentNumber]);

    const next = NEXT_STATUSES[application.status] ?? [];
    const skills = Array.isArray(profile?.skills) ? profile.skills : [];

    return (
        <div className="space-y-6">
            <div className="flex items-start gap-4">
                <Avatar name={application.student?.name} size="lg" />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{application.student?.name ?? 'Student'}</h3>
                        <StatusBadge status={application.status} />
                    </div>
                    {application.student?.email && (
                        <a href={`mailto:${application.student.email}`} className="text-sm text-primary-700 hover:underline inline-flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-4 h-4" />{application.student.email}
                        </a>
                    )}
                    <p className="text-sm text-text-muted mt-1">Student number {studentNumber ?? '—'}</p>
                </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                    <dt className="text-text-muted">Applied for</dt>
                    <dd className="font-medium">{application.internship?.title ?? '—'}</dd>
                </div>
                <div>
                    <dt className="text-text-muted">Applied on</dt>
                    <dd className="font-medium">{formatDate(application.dateApplied)}</dd>
                </div>
            </dl>

            <section>
                <h4 className="text-sm font-semibold mb-2">Cover letter</h4>
                {application.coverLetter?.trim() ? (
                    <p className="text-sm whitespace-pre-line rounded-lg bg-slate-50 border border-ui-border p-4">{application.coverLetter}</p>
                ) : (
                    <p className="text-sm text-text-muted">No cover letter was included.</p>
                )}
            </section>

            <section>
                <h4 className="text-sm font-semibold mb-2">Student profile</h4>
                {profileState === 'loading' ? (
                    <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>
                ) : profileState === 'missing' ? (
                    <p className="text-sm text-text-muted">This student has not completed a profile yet.</p>
                ) : (
                    <div className="space-y-3">
                        {profile?.bio && <p className="text-sm whitespace-pre-line">{profile.bio}</p>}
                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">{skills.map((s) => <Badge key={s}>{s}</Badge>)}</div>
                        )}
                        {profile?.resumeLink && (
                            <a href={profile.resumeLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline">
                                View CV <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                        {!profile?.bio && skills.length === 0 && !profile?.resumeLink && (
                            <p className="text-sm text-text-muted">The profile is empty.</p>
                        )}
                    </div>
                )}
            </section>

            <section className="pt-5 border-t border-ui-border">
                <h4 className="text-sm font-semibold mb-3">Update status</h4>
                {next.length === 0 ? (
                    <p className="text-sm text-text-muted">{STATUS_META[application.status]?.label ?? 'This'} is a final status. No further actions are available.</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {next.map((status) => {
                            const action = ACTIONS[status];
                            return (
                                <Button
                                    key={status}
                                    variant={action.variant}
                                    icon={action.icon}
                                    loading={updating === status}
                                    disabled={!!updating}
                                    onClick={() => onChangeStatus(application, status)}
                                >
                                    {action.label}
                                </Button>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

export default function CompanyApplicantsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const companyId = user?.companyId ?? user?.id;
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedPosting = searchParams.get('internship') ?? searchParams.get('internshipId') ?? '';

    const [applications, setApplications] = useState([]);
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusTab, setStatusTab] = useState('ALL');
    const [query, setQuery] = useState('');

    const [selectedId, setSelectedId] = useState(null);
    const [updating, setUpdating] = useState(null);
    const [confirm, setConfirm] = useState(null);

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!companyId) return undefined;
        let cancelled = false;
        Promise.all([getCompanyApplications(companyId), getInternshipsByCompany(companyId).catch(() => [])])
            .then(([apps, list]) => {
                if (cancelled) return;
                const sorted = (Array.isArray(apps) ? [...apps] : []).sort((a, b) => new Date(b.dateApplied ?? 0) - new Date(a.dateApplied ?? 0));
                setApplications(sorted);
                setPostings(Array.isArray(list) ? list : []);
            })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load applicants.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [companyId, reloadKey]);

    const retry = () => {
        setLoading(true);
        setError('');
        setReloadKey((k) => k + 1);
    };

    const postingOptions = useMemo(() => {
        const map = new Map(postings.map((p) => [p.internshipId, p.title]));
        applications.forEach((a) => {
            if (a.internship?.internshipId && !map.has(a.internship.internshipId)) map.set(a.internship.internshipId, a.internship.title);
        });
        return [...map.entries()].map(([id, title]) => ({ id, title })).sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
    }, [postings, applications]);

    const forPosting = useMemo(
        () => (selectedPosting ? applications.filter((a) => a.internship?.internshipId === selectedPosting) : applications),
        [applications, selectedPosting],
    );

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return forPosting.filter((a) => (statusTab === 'ALL' || a.status === statusTab) && (!q || (a.student?.name ?? '').toLowerCase().includes(q)));
    }, [forPosting, statusTab, query]);

    const tabs = [
        { value: 'ALL', label: 'All', count: forPosting.length },
        ...APPLICATION_STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label, count: forPosting.filter((a) => a.status === s).length })),
    ];

    const selected = applications.find((a) => a.applicationId === selectedId) ?? null;

    const onPostingChange = (e) => {
        const next = new URLSearchParams(searchParams);
        next.delete('internshipId');
        if (e.target.value) next.set('internship', e.target.value);
        else next.delete('internship');
        setSearchParams(next, { replace: true });
    };

    const applyStatus = async (application, status) => {
        setUpdating(status);
        try {
            const updated = await updateApplicationStatus(application.applicationId, status);
            setApplications((list) => list.map((a) => (a.applicationId === application.applicationId
                ? { ...a, status, updatedAt: updated?.updatedAt ?? new Date().toISOString() }
                : a)));
            toast(`${application.student?.name ?? 'Applicant'} moved to ${STATUS_META[status].label}`, 'success');
            setConfirm(null);
        } catch (err) {
            toast(errorMessage(err, 'Could not update the status.'), 'error');
        } finally {
            setUpdating(null);
        }
    };

    const requestStatus = (application, status) => {
        if (ACTIONS[status]?.confirm) {
            setConfirm({ application, status, ...CONFIRM_COPY[status](application.student?.name ?? 'This applicant') });
        } else {
            applyStatus(application, status);
        }
    };

    const postingTitle = postingOptions.find((p) => p.id === selectedPosting)?.title;

    return (
        <PageContainer>
            <PageHeader
                title="Applicants"
                subtitle={postingTitle ? `Reviewing applications for ${postingTitle}` : 'Review applications across all of your postings.'}
            />

            {error && (
                <Alert className="mb-6" title="Could not load applicants">
                    {error} <button onClick={retry} className="underline font-medium cursor-pointer">Try again</button>
                </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Select value={selectedPosting} onChange={onPostingChange} className="sm:max-w-xs" aria-label="Filter by posting">
                    <option value="">All postings</option>
                    {postingOptions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </Select>
                <div className="sm:max-w-xs w-full">
                    <Input icon={Search} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by student name" aria-label="Search by student name" />
                </div>
            </div>

            <Tabs tabs={tabs} value={statusTab} onChange={setStatusTab} className="mb-4" />

            <Card padding={false}>
                {loading ? (
                    <div className="divide-y divide-ui-border">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 px-5 py-4">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-1/2" /></div>
                            </div>
                        ))}
                    </div>
                ) : visible.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title={applications.length === 0 ? 'No applications yet' : 'No applicants match these filters'}
                        description={applications.length === 0
                            ? 'When students apply to your postings, they will appear here for review.'
                            : 'Try another status, posting or search term.'}
                    />
                ) : (
                    <ul className="divide-y divide-ui-border">
                        {visible.map((a) => (
                            <li key={a.applicationId}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(a.applicationId)}
                                    className="w-full text-left flex items-center gap-3 px-4 sm:px-5 py-4 hover:bg-slate-50 cursor-pointer"
                                >
                                    <Avatar name={a.student?.name} />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium truncate">{a.student?.name ?? 'Student'}</p>
                                        <p className="text-sm text-text-muted truncate">{a.student?.email}</p>
                                        <p className="text-sm text-text-muted truncate md:hidden">{a.internship?.title}</p>
                                    </div>
                                    <div className="hidden md:block min-w-0 w-64">
                                        <p className="text-sm truncate">{a.internship?.title}</p>
                                        <p className="text-xs text-text-muted">Applied {timeAgo(a.dateApplied)}</p>
                                    </div>
                                    <StatusBadge status={a.status} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <Modal
                open={!!selected}
                onClose={() => setSelectedId(null)}
                title="Application"
                description={selected?.internship?.title}
                size="lg"
            >
                {selected ? (
                    <ApplicantDetails
                        key={selected.applicationId}
                        application={selected}
                        onChangeStatus={requestStatus}
                        updating={confirm ? null : updating}
                    />
                ) : <Spinner />}
            </Modal>

            <ConfirmDialog
                open={!!confirm}
                onClose={() => !updating && setConfirm(null)}
                onConfirm={() => confirm && applyStatus(confirm.application, confirm.status)}
                title={confirm?.title}
                message={confirm?.message}
                confirmLabel={confirm?.confirmLabel}
                variant={confirm?.variant}
                loading={!!updating}
            />
        </PageContainer>
    );
}
