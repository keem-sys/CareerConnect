import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Building2 } from 'lucide-react';
import { TableToolbar, RowActions, FormModal } from '../components/admin/AdminKit';
import { getAllCompanies, createCompany, updateCompany, deleteCompany } from '../services/companyService';
import { getAllInternships } from '../services/internshipService';
import { useToast } from '../components/ui/Toast';
import {
    PageContainer, PageHeader, Card, Table, Button, Input, Field, Modal, ConfirmDialog, EmptyState, Spinner, Alert, Badge, CompanyLogo,
} from '../components/ui';
import { formatDate, errorMessage } from '../lib/format';

const EMPTY_NEW = { companyId: '', name: '', industry: '', contactEmail: '', password: '' };

const isOpen = (job) => job.open ?? (!job.deadline || new Date(job.deadline) >= new Date());

export default function AdminCompanyPage() {
    const { toast } = useToast();
    const [companies, setCompanies] = useState([]);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    const [viewing, setViewing] = useState(null);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [adding, setAdding] = useState(false);
    const [newCompany, setNewCompany] = useState(EMPTY_NEW);
    const [formError, setFormError] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;
        Promise.all([getAllCompanies(), getAllInternships().catch(() => [])])
            .then(([c, i]) => {
                if (cancelled) return;
                setCompanies(c || []);
                setInternships(i || []);
            })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load companies.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const jobsByCompany = useMemo(() => {
        const map = {};
        internships.forEach((j) => { (map[j.companyId] ||= []).push(j); });
        return map;
    }, [internships]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return companies
            .filter((c) => !q || [c.name, c.companyId, c.industry, c.contactEmail].some((v) => (v || '').toLowerCase().includes(q)))
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [companies, query]);

    const closeForms = () => { setAdding(false); setEditing(null); setFormError(''); };
    const setField = (setter) => (e) => setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');
        setBusy(true);
        try {
            const payload = Object.fromEntries(Object.entries(newCompany).map(([k, v]) => [k, k === 'password' ? v : v.trim()]));
            const created = await createCompany(payload);
            setCompanies((list) => [...list, created]);
            toast(`${created.name} registered`, 'success');
            setNewCompany(EMPTY_NEW);
            closeForms();
        } catch (err) {
            setFormError(errorMessage(err, 'Could not register the company.'));
        } finally {
            setBusy(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setFormError('');
        setBusy(true);
        try {
            const updated = await updateCompany(editing);
            setCompanies((list) => list.map((c) => (c.companyId === updated.companyId ? updated : c)));
            toast('Company details updated', 'success');
            closeForms();
        } catch (err) {
            setFormError(errorMessage(err, 'Could not update the company.'));
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        setBusy(true);
        try {
            await deleteCompany(deleting.companyId);
            setCompanies((list) => list.filter((c) => c.companyId !== deleting.companyId));
            toast(`${deleting.name} was removed`, 'success');
            setDeleting(null);
        } catch (err) {
            toast(errorMessage(err, 'Could not delete the company.'), 'error');
        } finally {
            setBusy(false);
        }
    };

    const columns = [
        { key: 'name', header: 'Company', render: (c) => (
            <div className="flex items-center gap-3">
                <CompanyLogo name={c.name} size="sm" />
                <div className="min-w-0">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-text-muted">{c.companyId}</p>
                </div>
            </div>
        ) },
        { key: 'industry', header: 'Industry', className: 'hidden sm:table-cell', render: (c) => c.industry || '—' },
        { key: 'contactEmail', header: 'Contact email', className: 'hidden md:table-cell text-text-muted' },
        { key: 'jobs', header: 'Internships', className: 'text-center', render: (c) => jobsByCompany[c.companyId]?.length ?? 0 },
        { key: 'actions', header: <span className="sr-only">Actions</span>, className: 'text-right whitespace-nowrap', render: (c) => (
            <RowActions onView={() => setViewing(c)} onEdit={() => setEditing({ ...c })} onDelete={() => setDeleting(c)} />
        ) },
    ];

    const viewingJobs = viewing ? jobsByCompany[viewing.companyId] ?? [] : [];

    return (
        <PageContainer>
            <PageHeader
                title="Companies"
                subtitle="Employer partners hiring through CareerConnect"
                actions={<Button icon={Plus} onClick={() => { setFormError(''); setAdding(true); }}>Add company</Button>}
            />

            <Card padding={false}>
                <TableToolbar query={query} onQuery={setQuery} placeholder="Search by name, industry or email" shown={filtered.length} total={companies.length} noun="companies" />
                {loading ? <Spinner label="Loading companies..." /> : error ? (
                    <div className="p-4"><Alert title="Could not load companies">{error}</Alert></div>
                ) : (
                    <Table
                        columns={columns}
                        rows={filtered}
                        rowKey={(c) => c.companyId}
                        empty={<EmptyState icon={Building2} title={query ? 'No matching companies' : 'No companies yet'} description={query ? 'Try a different search term.' : 'Employers appear here once they register.'} />}
                    />
                )}
            </Card>

            <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name} description={viewing ? `${viewing.industry} · ${viewing.contactEmail}` : ''} size="lg">
                {viewing && (viewingJobs.length === 0 ? (
                    <p className="text-sm text-text-muted">This company has not posted any internships yet.</p>
                ) : (
                    <ul className="divide-y divide-ui-border border border-ui-border rounded-lg">
                        {viewingJobs.map((j) => (
                            <li key={j.internshipId} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                                <div className="min-w-0">
                                    <Link to={`/internships/${j.internshipId}`} className="font-medium text-primary-700 hover:underline">{j.title}</Link>
                                    <p className="text-text-muted">{j.location || 'Location not set'} · Deadline {formatDate(j.deadline)}</p>
                                </div>
                                {isOpen(j) ? <Badge tone="success">Open</Badge> : <Badge tone="muted">Closed</Badge>}
                            </li>
                        ))}
                    </ul>
                ))}
            </Modal>

            <FormModal open={!!editing} onClose={closeForms} title="Edit company" description={editing?.companyId} formId="edit-company" onSubmit={handleUpdate} submitLabel="Save changes" busy={busy}>
                {formError && <Alert>{formError}</Alert>}
                <Field label="Company name" htmlFor="ec-name" required>
                    <Input id="ec-name" name="name" required value={editing?.name || ''} onChange={setField(setEditing)} />
                </Field>
                <Field label="Industry" htmlFor="ec-ind" required>
                    <Input id="ec-ind" name="industry" required value={editing?.industry || ''} onChange={setField(setEditing)} />
                </Field>
                <Field label="Contact email" htmlFor="ec-email" required>
                    <Input id="ec-email" name="contactEmail" type="email" required value={editing?.contactEmail || ''} onChange={setField(setEditing)} />
                </Field>
            </FormModal>

            <FormModal open={adding} onClose={closeForms} title="Add company" description="Register an employer partner on their behalf." formId="add-company" onSubmit={handleCreate} submitLabel="Register company" busy={busy}>
                {formError && <Alert>{formError}</Alert>}
                <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Company ID" htmlFor="nc-id" required hint="Unique reference, e.g. COMP-104">
                        <Input id="nc-id" name="companyId" required value={newCompany.companyId} onChange={setField(setNewCompany)} />
                    </Field>
                    <Field label="Company name" htmlFor="nc-name" required>
                        <Input id="nc-name" name="name" required value={newCompany.name} onChange={setField(setNewCompany)} />
                    </Field>
                    <Field label="Industry" htmlFor="nc-ind" required>
                        <Input id="nc-ind" name="industry" required value={newCompany.industry} onChange={setField(setNewCompany)} />
                    </Field>
                    <Field label="Contact email" htmlFor="nc-email" required>
                        <Input id="nc-email" name="contactEmail" type="email" required value={newCompany.contactEmail} onChange={setField(setNewCompany)} />
                    </Field>
                </div>
                <Field label="Temporary password" htmlFor="nc-pw" required hint="Share this with the employer so they can sign in.">
                    <Input id="nc-pw" name="password" type="password" required value={newCompany.password} onChange={setField(setNewCompany)} />
                </Field>
            </FormModal>

            <ConfirmDialog
                open={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={handleDelete}
                loading={busy}
                title="Delete company?"
                message={deleting ? `This permanently removes ${deleting.name} and its account access. This cannot be undone.` : ''}
                confirmLabel="Delete company"
            />
        </PageContainer>
    );
}
