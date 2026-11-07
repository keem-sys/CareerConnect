import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, Eye, Trash2 } from 'lucide-react';
import { getAllInternships, deleteInternship } from '../services/internshipService';
import { getAllCompanies } from '../services/companyService';
import { useToast } from '../components/ui/Toast';
import {
    PageContainer, PageHeader, Card, Table, Button, Input, Select, ConfirmDialog, EmptyState, Spinner, Alert, Badge,
} from '../components/ui';
import { formatDate, formatStipend, workModeLabel, errorMessage } from '../lib/format';

const isOpen = (job) => job.open ?? (!job.deadline || new Date(job.deadline) >= new Date());

export default function AdminInternshipPage() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('ALL');
    const [deleting, setDeleting] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;
        Promise.all([getAllInternships(), getAllCompanies().catch(() => [])])
            .then(([jobs, comps]) => {
                if (cancelled) return;
                setInternships(jobs || []);
                setCompanies(comps || []);
            })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load internships.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const companyNames = useMemo(() => Object.fromEntries(companies.map((c) => [c.companyId, c.name])), [companies]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return internships
            .filter((j) => status === 'ALL' || (status === 'OPEN') === isOpen(j))
            .filter((j) => !q || [j.title, j.location, companyNames[j.companyId]].some((v) => (v || '').toLowerCase().includes(q)))
            .sort((a, b) => new Date(b.createdAt || b.deadline || 0) - new Date(a.createdAt || a.deadline || 0));
    }, [internships, companyNames, query, status]);

    const openCount = internships.filter(isOpen).length;

    const handleDelete = async () => {
        setBusy(true);
        try {
            await deleteInternship(deleting.internshipId);
            setInternships((list) => list.filter((j) => j.internshipId !== deleting.internshipId));
            toast(`"${deleting.title}" was deleted`, 'success');
            setDeleting(null);
        } catch (err) {
            toast(errorMessage(err, 'Could not delete the internship.'), 'error');
        } finally {
            setBusy(false);
        }
    };

    const columns = [
        { key: 'title', header: 'Internship', render: (j) => (
            <div className="min-w-0">
                <p className="font-medium">{j.title}</p>
                <p className="text-xs text-text-muted lg:hidden">{companyNames[j.companyId] ?? 'Unknown company'}</p>
            </div>
        ) },
        { key: 'company', header: 'Company', className: 'hidden lg:table-cell', render: (j) => companyNames[j.companyId] ?? 'Unknown company' },
        { key: 'location', header: 'Location', className: 'hidden md:table-cell', render: (j) => j.location || '—' },
        { key: 'workMode', header: 'Work mode', className: 'hidden xl:table-cell', render: (j) => workModeLabel(j.workMode) ?? '—' },
        { key: 'stipend', header: 'Stipend', className: 'hidden xl:table-cell whitespace-nowrap', render: (j) => formatStipend(j.stipend) ?? '—' },
        { key: 'deadline', header: 'Deadline', className: 'hidden sm:table-cell whitespace-nowrap text-text-muted', render: (j) => formatDate(j.deadline) },
        { key: 'status', header: 'Status', render: (j) => (isOpen(j) ? <Badge tone="success">Open</Badge> : <Badge tone="muted">Closed</Badge>) },
        { key: 'actions', header: <span className="sr-only">Actions</span>, className: 'text-right whitespace-nowrap', render: (j) => (
            <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" icon={Eye} aria-label="View" onClick={() => navigate(`/internships/${j.internshipId}`)} />
                <Button variant="ghost" size="sm" icon={Trash2} aria-label="Delete" className="hover:!text-rose-600" onClick={() => setDeleting(j)} />
            </div>
        ) },
    ];

    return (
        <PageContainer>
            <PageHeader title="Internships" subtitle={`All listings on the platform · ${openCount} open, ${internships.length - openCount} closed`} />

            <Card padding={false}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-ui-border">
                    <div className="w-full sm:max-w-sm">
                        <Input icon={Search} placeholder="Search by title, company or location" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                    <Select className="sm:w-40" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
                        <option value="ALL">All listings</option>
                        <option value="OPEN">Open</option>
                        <option value="CLOSED">Closed</option>
                    </Select>
                    <p className="text-sm text-text-muted sm:ml-auto">{filtered.length} of {internships.length} internships</p>
                </div>
                {loading ? <Spinner label="Loading internships..." /> : error ? (
                    <div className="p-4"><Alert title="Could not load internships">{error}</Alert></div>
                ) : (
                    <Table
                        columns={columns}
                        rows={filtered}
                        rowKey={(j) => j.internshipId}
                        empty={<EmptyState icon={Briefcase} title={query || status !== 'ALL' ? 'No matching internships' : 'No internships yet'} description={query || status !== 'ALL' ? 'Try adjusting your search or filter.' : 'Listings appear here once employers post them.'} />}
                    />
                )}
            </Card>

            <ConfirmDialog
                open={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={handleDelete}
                loading={busy}
                title="Delete internship?"
                message={deleting ? `"${deleting.title}" and its applications will be permanently removed. This cannot be undone.` : ''}
                confirmLabel="Delete internship"
            />
        </PageContainer>
    );
}
