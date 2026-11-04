import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle2, Clock, PlusCircle, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getCompanyStats } from '../../services/statsService';
import { getCompanyApplications } from '../../services/applicationService';
import {
    Alert, Avatar, Badge, Button, Card, CardHeader, EmptyState, PageContainer, PageHeader,
    Skeleton, StatCard, StatusBadge, Table, cx,
} from '../../components/ui';
import { STATUS_META, errorMessage, formatDate, timeAgo } from '../../lib/format';

const PIPELINE = [
    { status: 'PENDING', bar: 'bg-slate-400' },
    { status: 'UNDER_REVIEW', bar: 'bg-primary-500' },
    { status: 'SHORTLISTED', bar: 'bg-violet-500' },
    { status: 'ACCEPTED', bar: 'bg-emerald-500' },
    { status: 'REJECTED', bar: 'bg-rose-400' },
];

function HiringPipeline({ byStatus = {} }) {
    const counts = PIPELINE.map((p) => ({ ...p, count: byStatus[p.status] ?? 0 }));
    const total = counts.reduce((sum, c) => sum + c.count, 0);

    return (
        <Card>
            <CardHeader title="Hiring pipeline" subtitle="Where your applicants currently stand" />
            {total === 0 ? (
                <p className="text-sm text-text-muted">No applications yet. They will appear here as students apply.</p>
            ) : (
                <>
                    <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100" aria-hidden="true">
                        {counts.filter((c) => c.count > 0).map((c) => (
                            <div key={c.status} className={c.bar} style={{ width: `${(c.count / total) * 100}%` }} />
                        ))}
                    </div>
                    <ul className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {counts.map((c) => (
                            <li key={c.status} className="rounded-lg border border-ui-border px-3 py-2.5">
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <span className={cx('w-2.5 h-2.5 rounded-full', c.bar)} />
                                    {STATUS_META[c.status].label}
                                </div>
                                <p className="text-xl font-bold mt-1">{c.count}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </Card>
    );
}

export default function CompanyDashboardPage() {
    const { user } = useAuth();
    const companyId = user?.companyId ?? user?.id;

    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!companyId) return undefined;
        let cancelled = false;
        Promise.all([getCompanyStats(companyId), getCompanyApplications(companyId)])
            .then(([s, apps]) => {
                if (cancelled) return;
                setStats(s);
                const list = Array.isArray(apps) ? [...apps] : [];
                list.sort((a, b) => new Date(b.dateApplied ?? 0) - new Date(a.dateApplied ?? 0));
                setRecent(list.slice(0, 5));
            })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load your dashboard.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [companyId, reloadKey]);

    const retry = () => {
        setLoading(true);
        setError('');
        setReloadKey((k) => k + 1);
    };

    const postings = stats?.postings ?? [];
    const isNew = !loading && !error && stats && (stats.totalPostings ?? postings.length) === 0;

    const columns = [
        {
            key: 'title',
            header: 'Posting',
            render: (p) => <Link to={`/internships/${p.internshipId}`} className="font-medium text-text-main hover:text-primary-700">{p.title}</Link>,
        },
        { key: 'open', header: 'Status', render: (p) => <Badge tone={p.open ? 'success' : 'muted'}>{p.open ? 'Open' : 'Closed'}</Badge> },
        { key: 'deadline', header: 'Deadline', className: 'hidden md:table-cell whitespace-nowrap', render: (p) => formatDate(p.deadline) },
        { key: 'applicants', header: 'Applicants', className: 'text-right', render: (p) => p.applicants ?? 0 },
        {
            key: 'pendingReview',
            header: 'To review',
            className: 'text-right hidden sm:table-cell',
            render: (p) => (p.pendingReview ? <Badge tone="warning">{p.pendingReview}</Badge> : <span className="text-text-subtle">0</span>),
        },
        {
            key: 'action',
            header: '',
            className: 'text-right',
            render: (p) => <Button size="sm" variant="secondary" to={`/company/applicants?internship=${p.internshipId}`}>Review</Button>,
        },
    ];

    return (
        <PageContainer>
            <PageHeader
                title={`Welcome back, ${user?.name || 'there'}`}
                subtitle="Here is how your internship listings are performing."
                actions={<Button icon={PlusCircle} to="/internships/new">Post internship</Button>}
            />

            {error && (
                <Alert className="mb-6" title="Something went wrong">
                    {error} <button onClick={retry} className="underline font-medium cursor-pointer">Try again</button>
                </Alert>
            )}

            {isNew ? (
                <Card>
                    <EmptyState
                        icon={Briefcase}
                        title="Post your first internship"
                        description="Publish a listing to start receiving applications from CPUT students. It only takes a few minutes."
                        action={<Button icon={PlusCircle} to="/internships/new">Post an internship</Button>}
                    />
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Active postings" value={stats?.activePostings ?? 0} icon={Briefcase} hint={stats ? `${stats.totalPostings ?? 0} total` : undefined} loading={loading} />
                        <StatCard label="Total applicants" value={stats?.totalApplicants ?? 0} icon={Users} tone="purple" loading={loading} />
                        <StatCard label="Awaiting review" value={stats?.awaitingReview ?? 0} icon={Clock} tone="warning" loading={loading} />
                        <StatCard label="Hired" value={stats?.hired ?? 0} icon={CheckCircle2} tone="success" loading={loading} />
                    </div>

                    {loading ? (
                        <Card><Skeleton className="h-5 w-40 mb-4" /><Skeleton className="h-3 w-full" /></Card>
                    ) : stats && <HiringPipeline byStatus={stats.byStatus} />}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <Card padding={false} className="lg:col-span-2">
                            <div className="px-5 sm:px-6 pt-5 sm:pt-6">
                                <CardHeader
                                    title="Your postings"
                                    subtitle="Applicants and outstanding reviews per listing"
                                    action={<Link to="/company/postings" className="text-sm font-medium text-primary-700 hover:underline">Manage</Link>}
                                />
                            </div>
                            {loading ? (
                                <div className="px-6 pb-6 space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                            ) : (
                                <Table
                                    columns={columns}
                                    rows={postings}
                                    rowKey={(p) => p.internshipId}
                                    empty={<EmptyState icon={Briefcase} title="No postings yet" />}
                                />
                            )}
                        </Card>

                        <Card>
                            <CardHeader
                                title="Recent applicants"
                                action={<Link to="/company/applicants" className="text-sm font-medium text-primary-700 hover:underline">View all</Link>}
                            />
                            {loading ? (
                                <div className="space-y-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                            ) : recent.length === 0 ? (
                                <EmptyState icon={Users} title="No applicants yet" description="New applications will show up here." className="py-6" />
                            ) : (
                                <ul className="divide-y divide-ui-border -my-2">
                                    {recent.map((a) => (
                                        <li key={a.applicationId}>
                                            <Link
                                                to={`/company/applicants?internship=${a.internship?.internshipId ?? ''}`}
                                                className="flex items-center gap-3 py-3 rounded-lg hover:bg-slate-50 -mx-2 px-2"
                                            >
                                                <Avatar name={a.student?.name} size="sm" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium truncate">{a.student?.name ?? 'Student'}</p>
                                                    <p className="text-xs text-text-muted truncate">{a.internship?.title} · {timeAgo(a.dateApplied)}</p>
                                                </div>
                                                <StatusBadge status={a.status} />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    </div>
                </div>
            )}
        </PageContainer>
    );
}
