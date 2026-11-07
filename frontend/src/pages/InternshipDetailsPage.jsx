import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Briefcase, CalendarClock, Users, Wallet, Clock, CalendarDays,
    UserCheck, Building2, CheckCircle2, Lock, SearchX,
} from 'lucide-react';
import {
    Alert, Badge, Button, Card, CompanyLogo, EmptyState, Modal, PageContainer, Skeleton,
    StatusBadge, Textarea, Field, cx,
} from '../components/ui';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext.jsx';
import { getInternshipDetails } from '../services/internshipService';
import { applyForInternship, getStudentApplications } from '../services/applicationService';
import {
    daysUntil, deadlineLabel, errorMessage, formatDate, formatStipend, timeAgo, workModeLabel,
} from '../lib/format';

const COVER_LETTER_MAX = 2000;

export default function InternshipDetailsPage() {
    const { id } = useParams();
    const location = useLocation();
    const { user } = useAuth();
    const { toast } = useToast();

    const [state, setState] = useState({ id: null, internship: null, error: '', notFound: false });
    const [application, setApplication] = useState({ id: null, value: null });
    const [modalOpen, setModalOpen] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [applyError, setApplyError] = useState('');

    const isStudent = user?.role === 'STUDENT';

    useEffect(() => {
        let cancelled = false;
        getInternshipDetails(id)
            .then((data) => { if (!cancelled) setState({ id, internship: data, error: '', notFound: !data }); })
            .catch((err) => {
                if (cancelled) return;
                const status = err?.response?.status;
                setState({ id, internship: null, notFound: status === 404 || status === 400, error: errorMessage(err, 'Could not load this internship.') });
            });
        return () => { cancelled = true; };
    }, [id]);

    useEffect(() => {
        if (!isStudent) return undefined;
        let cancelled = false;
        getStudentApplications(user.id)
            .then((apps) => {
                if (cancelled) return;
                const match = (apps ?? []).find((a) => String(a.internship?.internshipId) === String(id));
                setApplication({ id, value: match ?? null });
            })
            .catch(() => { if (!cancelled) setApplication({ id, value: null }); });
        return () => { cancelled = true; };
    }, [id, isStudent, user?.id]);

    const loading = state.id !== id;

    if (loading) return <DetailsSkeleton />;

    if (state.notFound || (!state.internship && !state.error)) {
        return (
            <PageContainer>
                <BackLink />
                <Card padding={false}>
                    <EmptyState
                        icon={SearchX}
                        title="Internship not found"
                        description="This internship may have been removed or the link is incorrect."
                        action={<Button to="/internships">Browse internships</Button>}
                    />
                </Card>
            </PageContainer>
        );
    }

    if (state.error) {
        return (
            <PageContainer>
                <BackLink />
                <Alert title="We couldn't load this internship">{state.error}</Alert>
            </PageContainer>
        );
    }

    const internship = state.internship;
    const days = daysUntil(internship.deadline);
    const closed = internship.open === false || (days !== null && days < 0);
    const urgent = closed || (days !== null && days <= 3);
    const mode = workModeLabel(internship.workMode);
    const pay = formatStipend(internship.stipend);
    const skills = internship.requiredSkills ?? [];
    const applicants = internship.applicantCount ?? 0;
    const companyId = user?.role === 'COMPANY' ? (user.companyId ?? user.id) : null;
    const isOwner = companyId && String(companyId) === String(internship.companyId);
    const existing = application.id === id ? application.value : null;
    const checkingApplication = isStudent && application.id !== id;

    const openApply = () => {
        setApplyError('');
        setModalOpen(true);
    };

    const submitApplication = async () => {
        setSubmitting(true);
        setApplyError('');
        try {
            const created = await applyForInternship(user.id, internship.internshipId, coverLetter.trim());
            setApplication({ id, value: created ?? { status: 'PENDING' } });
            setState((s) => ({ ...s, internship: { ...s.internship, applicantCount: (s.internship.applicantCount ?? 0) + 1 } }));
            setModalOpen(false);
            setCoverLetter('');
            toast('Application submitted', 'success');
        } catch (err) {
            setApplyError(errorMessage(err, 'Could not submit your application.'));
        } finally {
            setSubmitting(false);
        }
    };

    const details = [
        { icon: Wallet, label: 'Stipend', value: pay ?? 'Not specified' },
        { icon: Clock, label: 'Duration', value: internship.durationMonths ? `${internship.durationMonths} month${internship.durationMonths === 1 ? '' : 's'}` : 'Not specified' },
        { icon: CalendarDays, label: 'Start date', value: internship.startDate ? formatDate(internship.startDate) : 'Flexible' },
        { icon: UserCheck, label: 'Positions', value: internship.positions ?? 'Not specified' },
        { icon: CalendarClock, label: 'Apply by', value: internship.deadline ? formatDate(internship.deadline) : 'No deadline' },
        { icon: Briefcase, label: 'Work mode', value: mode ?? 'Not specified' },
        { icon: Users, label: 'Applicants', value: applicants },
    ];

    let action;
    if (!user) {
        action = closed
            ? <Button className="w-full" disabled icon={Lock}>Applications closed</Button>
            : <Button className="w-full" size="lg" to="/login" state={{ from: location }}>Sign in to apply</Button>;
    } else if (isStudent) {
        if (checkingApplication) {
            action = <Skeleton className="h-12 w-full rounded-lg" />;
        } else if (existing) {
            action = (
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                            <CheckCircle2 className="w-4 h-4" /> Applied
                        </span>
                        <StatusBadge status={existing.status} />
                    </div>
                    <Button variant="secondary" className="w-full" to="/applications">View my applications</Button>
                </div>
            );
        } else if (closed) {
            action = <Button className="w-full" disabled icon={Lock}>Applications closed</Button>;
        } else {
            action = <Button className="w-full" size="lg" onClick={openApply}>Apply now</Button>;
        }
    } else if (isOwner) {
        action = <Button className="w-full" variant="secondary" icon={Users} to={`/company/applicants?internship=${internship.internshipId}`}>View applicants</Button>;
    } else if (closed) {
        action = <Button className="w-full" disabled icon={Lock}>Applications closed</Button>;
    }

    return (
        <PageContainer>
            <BackLink />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
                {/* Main */}
                <div className="space-y-6 min-w-0">
                    <Card>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <CompanyLogo name={internship.companyName || internship.title} size="lg" />
                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl sm:text-[28px] font-bold leading-tight">{internship.title}</h1>
                                <p className="mt-1 text-base text-text-muted">{internship.companyName || 'Company'}</p>
                                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
                                    {internship.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-text-subtle" />{internship.location}</span>}
                                    {mode && <Badge tone="info">{mode}</Badge>}
                                    {internship.fieldOfStudy && <span className="inline-flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-text-subtle" />{internship.fieldOfStudy}</span>}
                                    <span className={cx('inline-flex items-center gap-1.5', urgent && 'text-rose-600 font-medium')}>
                                        <CalendarClock className={cx('w-4 h-4', urgent ? 'text-rose-500' : 'text-text-subtle')} />
                                        {closed ? 'Closed' : deadlineLabel(internship.deadline)}
                                    </span>
                                    {internship.createdAt && <span>Posted {timeAgo(internship.createdAt)}</span>}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold mb-3">About the internship</h2>
                        {internship.description ? (
                            <p className="text-[15px] leading-relaxed text-text-main whitespace-pre-line">{internship.description}</p>
                        ) : (
                            <p className="text-sm text-text-muted">No description provided.</p>
                        )}

                        {skills.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-ui-border">
                                <h3 className="text-base font-semibold mb-3">Required skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((s) => <Badge key={s} tone="neutral" className="text-sm px-2.5 py-1">{s}</Badge>)}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold mb-4">About the company</h2>
                        <div className="flex items-center gap-4">
                            <CompanyLogo name={internship.companyName || internship.title} />
                            <div className="min-w-0">
                                <p className="font-semibold">{internship.companyName || 'Company'}</p>
                                <p className="text-sm text-text-muted inline-flex items-center gap-1.5">
                                    <Building2 className="w-4 h-4 text-text-subtle" />
                                    {internship.companyIndustry || 'Industry not specified'}
                                </p>
                            </div>
                        </div>
                        {internship.companyName && (
                            <Link
                                to={`/internships?q=${encodeURIComponent(internship.companyName)}`}
                                className="mt-4 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800"
                            >
                                More internships from {internship.companyName}
                            </Link>
                        )}
                    </Card>
                </div>

                {/* Side card */}
                <aside className="lg:sticky lg:top-20">
                    <Card>
                        <p className="text-sm text-text-muted">Monthly stipend</p>
                        <p className="text-2xl font-bold mt-0.5">{pay ?? 'Not specified'}</p>

                        <dl className="mt-5 divide-y divide-ui-border border-y border-ui-border">
                            {details.map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                                    <dt className="inline-flex items-center gap-2 text-text-muted"><Icon className="w-4 h-4 text-text-subtle" />{label}</dt>
                                    <dd className="font-medium text-text-main text-right">{value}</dd>
                                </div>
                            ))}
                        </dl>

                        {action && <div className="mt-5">{action}</div>}
                        {!user && !closed && (
                            <p className="mt-3 text-xs text-text-muted text-center">
                                New here? <Link to="/signup" className="font-semibold text-primary-700 hover:text-primary-800">Create a student account</Link>
                            </p>
                        )}
                    </Card>
                </aside>
            </div>

            <Modal
                open={modalOpen}
                onClose={() => !submitting && setModalOpen(false)}
                title={`Apply for ${internship.title}`}
                description={internship.companyName}
                footer={(
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={submitting}>Cancel</Button>
                        <Button onClick={submitApplication} loading={submitting}>Submit application</Button>
                    </>
                )}
            >
                <div className="space-y-4">
                    {applyError && <Alert>{applyError}</Alert>}
                    <p className="text-sm text-text-muted">
                        Your profile, skills and CV link will be shared with the employer. Adding a short cover letter helps you stand out.
                    </p>
                    <Field
                        label="Cover letter (optional)"
                        htmlFor="cover-letter"
                        hint={`${coverLetter.length} / ${COVER_LETTER_MAX} characters`}
                    >
                        <Textarea
                            id="cover-letter"
                            rows={8}
                            maxLength={COVER_LETTER_MAX}
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Explain why you're interested in this role and what you would bring to the team."
                        />
                    </Field>
                </div>
            </Modal>
        </PageContainer>
    );
}

function BackLink() {
    return (
        <Link to="/internships" className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-main mb-5">
            <ArrowLeft className="w-4 h-4" /> Back to internships
        </Link>
    );
}

function DetailsSkeleton() {
    return (
        <PageContainer>
            <Skeleton className="h-5 w-40 mb-5" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                <div className="space-y-6">
                    <Card>
                        <div className="flex gap-4">
                            <Skeleton className="w-16 h-16 rounded-lg" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-7 w-2/3" />
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    </Card>
                    <Card className="space-y-3">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </Card>
                </div>
                <Card className="space-y-3">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                </Card>
            </div>
        </PageContainer>
    );
}
