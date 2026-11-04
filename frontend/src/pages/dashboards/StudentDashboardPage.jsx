import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase, Activity, Star, Award, ArrowRight, Search, CheckCircle2, MapPin, CalendarClock, UserCircle,
    Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStudentStats } from '../../services/statsService';
import { getStudentApplications } from '../../services/applicationService';
import { searchInternships } from '../../services/internshipService';
import { getProfileByStudentNumber } from '../../services/profileService';
import {
    PageContainer, PageHeader, Card, CardHeader, Button, StatCard, StatusBadge, ProgressBar,
    EmptyState, Skeleton, Alert, CompanyLogo, Badge,
} from '../../components/ui';
import { timeAgo, deadlineLabel, daysUntil, formatStipend, workModeLabel, errorMessage } from '../../lib/format';

const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

const normalise = (s) => String(s).trim().toLowerCase();

function skillOverlap(internship, skillSet) {
    return (internship.requiredSkills ?? []).filter((s) => skillSet.has(normalise(s))).length;
}

async function loadProfileSkills(studentNumber) {
    try {
        const profile = await getProfileByStudentNumber(studentNumber);
        return profile?.skills ?? [];
    } catch {
        // No profile yet (404) or not accessible: recommend without skill ranking.
        return [];
    }
}

function RecommendationCard({ internship, matched }) {
    const days = daysUntil(internship.deadline);
    const stipend = formatStipend(internship.stipend);
    const mode = workModeLabel(internship.workMode);
    return (
        <Link
            to={`/internships/${internship.internshipId}`}
            className="block rounded-lg border border-ui-border p-4 transition hover:border-primary-200 hover:bg-primary-50/30"
        >
            <div className="flex items-start gap-3">
                <CompanyLogo name={internship.companyName} size="sm" />
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-main truncate">{internship.title}</p>
                    <p className="text-sm text-text-muted truncate">{internship.companyName}</p>
                </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
                {internship.location && (
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{internship.location}</span>
                )}
                {mode && <span>{mode}</span>}
                {stipend && <span>{stipend}</span>}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone={days !== null && days <= 7 ? 'warning' : 'neutral'} icon={CalendarClock}>
                    {deadlineLabel(internship.deadline)}
                </Badge>
                {matched > 0 && (
                    <Badge tone="info">{matched} matching skill{matched === 1 ? '' : 's'}</Badge>
                )}
            </div>
        </Link>
    );
}

export default function StudentDashboardPage() {
    const { user } = useAuth();
    const studentNumber = user?.id;
    const firstName = (user?.name ?? '').split(' ')[0] || 'there';

    const [stats, setStats] = useState(null);
    const [statsError, setStatsError] = useState(null);
    const [applications, setApplications] = useState(null);
    const [appsError, setAppsError] = useState(null);
    const [recommended, setRecommended] = useState(null);
    const [recError, setRecError] = useState(null);

    useEffect(() => {
        if (!studentNumber) return undefined;
        let cancelled = false;

        getStudentStats(studentNumber)
            .then((data) => { if (!cancelled) setStats(data); })
            .catch((err) => { if (!cancelled) setStatsError(errorMessage(err, 'Could not load your stats.')); });

        const appsPromise = getStudentApplications(studentNumber)
            .then((data) => {
                const sorted = [...(data ?? [])].sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied));
                if (!cancelled) setApplications(sorted);
                return sorted;
            })
            .catch((err) => {
                if (!cancelled) setAppsError(errorMessage(err, 'Could not load your applications.'));
                return [];
            });

        Promise.all([
            searchInternships({ openOnly: true, sort: 'deadline', limit: 20 }),
            appsPromise,
            loadProfileSkills(studentNumber),
        ])
            .then(([internships, apps, skills]) => {
                const applied = new Set(apps.map((a) => a.internship?.internshipId));
                const skillSet = new Set(skills.map(normalise));
                const ranked = (internships ?? [])
                    .filter((i) => !applied.has(i.internshipId))
                    .map((i, index) => ({ internship: i, matched: skillOverlap(i, skillSet), index }))
                    .sort((a, b) => b.matched - a.matched || a.index - b.index)
                    .slice(0, 4);
                if (!cancelled) setRecommended(ranked);
            })
            .catch((err) => { if (!cancelled) setRecError(errorMessage(err, 'Could not load recommendations.')); });

        return () => { cancelled = true; };
    }, [studentNumber]);

    const statsLoading = !stats && !statsError;
    const completeness = stats?.profileCompleteness ?? 0;
    const missing = stats?.missingProfileItems ?? [];

    return (
        <PageContainer>
            <PageHeader
                title={`${greeting()}, ${firstName}`}
                subtitle="Here is an overview of your internship search."
                actions={<Button to="/internships" icon={Search}>Browse internships</Button>}
            />

            {statsError && <Alert className="mb-6">{statsError}</Alert>}

            {stats?.offers > 0 && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Sparkles className="w-5 h-5" />
                        </span>
                        <div>
                            <h3 className="font-semibold text-emerald-950">
                                You have {stats.offers} active internship offer{stats.offers > 1 ? 's' : ''}!
                            </h3>
                            <p className="text-sm text-emerald-800">
                                Review your proposed start date, stipend, and recommended CPUT onboarding steps.
                            </p>
                        </div>
                    </div>
                    <Button to="/applications" variant="success" size="sm" className="shrink-0">
                        View offer details
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total applications" value={stats?.totalApplications ?? 0} icon={Briefcase} loading={statsLoading} />
                <StatCard label="Active" value={stats?.activeApplications ?? 0} icon={Activity} tone="neutral" hint="Awaiting a decision" loading={statsLoading} />
                <StatCard label="Shortlisted" value={stats?.byStatus?.SHORTLISTED ?? 0} icon={Star} tone="purple" loading={statsLoading} />
                <StatCard label="Offers" value={stats?.offers ?? 0} icon={Award} tone="success" loading={statsLoading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader
                            title="Recent applications"
                            subtitle="Your latest activity"
                            action={<Button to="/applications" variant="ghost" size="sm">View all <ArrowRight className="w-4 h-4" /></Button>}
                        />
                        {appsError ? (
                            <Alert>{appsError}</Alert>
                        ) : applications === null ? (
                            <div className="space-y-3">
                                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
                            </div>
                        ) : applications.length === 0 ? (
                            <EmptyState
                                icon={Briefcase}
                                title="No applications yet"
                                description="Find an internship that fits your skills and apply in a few clicks."
                                action={<Button to="/internships" icon={Search}>Find internships</Button>}
                            />
                        ) : (
                            <ul className="divide-y divide-ui-border -my-2">
                                {applications.slice(0, 5).map((app) => (
                                    <li key={app.applicationId} className="flex items-center gap-3 py-3">
                                        <CompanyLogo name={app.internship?.companyName} size="sm" />
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                to={`/internships/${app.internship?.internshipId}`}
                                                className="font-medium text-text-main hover:text-primary-700 truncate block"
                                            >
                                                {app.internship?.title ?? 'Internship'}
                                            </Link>
                                            <p className="text-sm text-text-muted truncate">
                                                {app.internship?.companyName}
                                                {app.dateApplied && <span className="text-text-subtle"> · Applied {timeAgo(app.dateApplied)}</span>}
                                            </p>
                                        </div>
                                        <StatusBadge status={app.status} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <Card>
                        <CardHeader
                            title="Recommended for you"
                            subtitle="Open internships closing soon, matched to your skills"
                            action={<Button to="/internships" variant="ghost" size="sm">Browse all <ArrowRight className="w-4 h-4" /></Button>}
                        />
                        {recError ? (
                            <Alert>{recError}</Alert>
                        ) : recommended === null ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
                            </div>
                        ) : recommended.length === 0 ? (
                            <EmptyState
                                icon={Search}
                                title="No new recommendations"
                                description="You have applied to every open internship. Check back soon for new postings."
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {recommended.map(({ internship, matched }) => (
                                    <RecommendationCard key={internship.internshipId} internship={internship} matched={matched} />
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader title="Profile strength" subtitle="Complete profiles get noticed by employers" />
                        {statsLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-2 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : statsError ? (
                            <p className="text-sm text-text-muted">Profile details are unavailable right now.</p>
                        ) : (
                            <>
                                <div className="flex items-baseline justify-between mb-2">
                                    <span className="text-2xl font-bold">{completeness}%</span>
                                    <span className="text-sm text-text-muted">complete</span>
                                </div>
                                <ProgressBar value={completeness} />
                                {completeness >= 100 ? (
                                    <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
                                        <CheckCircle2 className="w-4 h-4" /> Profile complete
                                    </p>
                                ) : (
                                    <>
                                        {missing.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium mb-2">Still missing</p>
                                                <ul className="space-y-1.5">
                                                    {missing.map((item) => (
                                                        <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <Button to="/profile" variant="secondary" icon={UserCircle} className="mt-5 w-full">
                                            Complete your profile
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
