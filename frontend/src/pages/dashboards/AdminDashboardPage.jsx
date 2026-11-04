import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Briefcase, FileText, Award, ChevronRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAdminStats } from '../../services/statsService';
import { getAllApplications } from '../../services/applicationService';
import {
    PageContainer, PageHeader, StatCard, Card, CardHeader, Table, StatusBadge, Alert, Button, EmptyState, Skeleton, cx,
} from '../../components/ui';
import { APPLICATION_STATUSES, STATUS_META, formatDate, errorMessage } from '../../lib/format';

const BAR_COLORS = {
    neutral: 'bg-slate-400',
    info: 'bg-primary-500',
    purple: 'bg-violet-500',
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
    muted: 'bg-slate-300',
};

const QUICK_LINKS = [
    { to: '/admin/students', icon: Users, title: 'Manage students', text: 'View, edit and remove student accounts.' },
    { to: '/admin/companies', icon: Building2, title: 'Manage companies', text: 'Review employer partners and their postings.' },
    { to: '/admin/internships', icon: Briefcase, title: 'Manage internships', text: 'Moderate listings across the platform.' },
];

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        Promise.all([getAdminStats(), getAllApplications().catch(() => [])])
            .then(([s, apps]) => {
                if (cancelled) return;
                setStats(s);
                const sorted = [...(apps || [])].sort((a, b) => new Date(b.dateApplied || 0) - new Date(a.dateApplied || 0));
                setRecent(sorted.slice(0, 8));
            })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load platform statistics.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [reloadKey]);

    const load = () => {
        setLoading(true);
        setError('');
        setReloadKey((k) => k + 1);
    };

    const byStatus = stats?.byStatus ?? {};
    const maxCount = Math.max(1, ...APPLICATION_STATUSES.map((s) => byStatus[s] ?? 0));
    const rate = stats?.placementRate != null ? `${stats.placementRate}% placement rate (of decided)` : undefined;

    const columns = [
        { key: 'student', header: 'Student', render: (a) => (
            <div>
                <p className="font-medium text-text-main">{a.student?.name ?? '—'}</p>
                <p className="text-xs text-text-muted">{a.student?.studentNumber}</p>
            </div>
        ) },
        { key: 'internship', header: 'Internship', render: (a) => (
            a.internship?.internshipId
                ? <Link to={`/internships/${a.internship.internshipId}`} className="text-primary-700 hover:underline">{a.internship.title}</Link>
                : '—'
        ) },
        { key: 'company', header: 'Company', className: 'hidden md:table-cell', render: (a) => a.internship?.companyName ?? '—' },
        { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
        { key: 'date', header: 'Applied', className: 'hidden sm:table-cell whitespace-nowrap text-text-muted', render: (a) => formatDate(a.dateApplied) },
    ];

    return (
        <PageContainer>
            <PageHeader
                title="Platform overview"
                subtitle={`Welcome back${user?.name ? `, ${user.name}` : ''}. Here is how CareerConnect is performing.`}
                actions={<Button variant="secondary" icon={RefreshCw} onClick={load} loading={loading}>Refresh</Button>}
            />

            {error && <Alert className="mb-6" title="Something went wrong">{error}</Alert>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <StatCard label="Students" value={stats?.students ?? 0} icon={Users} loading={loading} />
                <StatCard label="Companies" value={stats?.companies ?? 0} icon={Building2} tone="purple" loading={loading} />
                <StatCard label="Open internships" value={stats?.openInternships ?? 0} hint={stats ? `of ${stats.internships} total` : undefined} icon={Briefcase} tone="neutral" loading={loading} />
                <StatCard label="Applications" value={stats?.applications ?? 0} icon={FileText} tone="warning" loading={loading} />
                <StatCard label="Placements" value={stats?.placements ?? 0} hint={rate} icon={Award} tone="success" loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                    <CardHeader title="Applications by status" subtitle="Where every application currently stands" />
                    {loading ? (
                        <div className="space-y-3">{APPLICATION_STATUSES.map((s) => <Skeleton key={s} className="h-6 w-full" />)}</div>
                    ) : (
                        <div className="space-y-3">
                            {APPLICATION_STATUSES.map((s) => {
                                const count = byStatus[s] ?? 0;
                                return (
                                    <div key={s} className="flex items-center gap-3">
                                        <span className="w-28 shrink-0 text-sm text-text-muted">{STATUS_META[s].label}</span>
                                        <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className={cx('h-full rounded-full', BAR_COLORS[STATUS_META[s].tone])} style={{ width: `${(count / maxCount) * 100}%` }} />
                                        </div>
                                        <span className="w-10 text-right text-sm font-semibold">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                <div className="space-y-3">
                    {QUICK_LINKS.map(({ to, icon: Icon, title, text }) => (
                        <Link key={to} to={to} className="block">
                            <Card hover className="flex items-center gap-4 !p-4">
                                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold">{title}</p>
                                    <p className="text-sm text-text-muted">{text}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-text-subtle" />
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            <Card padding={false}>
                <div className="px-5 sm:px-6 pt-5">
                    <CardHeader title="Recent applications" subtitle="The latest submissions across all companies" />
                </div>
                {loading ? (
                    <div className="px-6 pb-6 space-y-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : (
                    <Table
                        columns={columns}
                        rows={recent}
                        rowKey={(a) => a.applicationId}
                        empty={<EmptyState icon={FileText} title="No applications yet" description="Applications will appear here once students start applying." />}
                    />
                )}
            </Card>
        </PageContainer>
    );
}
