import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Eye, MapPin, Pencil, PlusCircle, Users, Wallet, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInternshipsByCompany, updateInternship } from '../services/internshipService';
import { getCompanyStats } from '../services/statsService';
import { useToast } from '../components/ui/Toast';
import {
    Alert, Badge, Button, Card, EmptyState, Modal, PageContainer, PageHeader, Skeleton, Tabs,
} from '../components/ui';
import InternshipForm from '../components/company/InternshipForm';
import { toFormValues, toPayload, validateInternship } from '../components/company/internshipFormUtils';
import { deadlineLabel, errorMessage, formatDate, formatStipend, workModeLabel } from '../lib/format';

const isOpen = (p) => (typeof p.open === 'boolean' ? p.open : p.deadline ? new Date(p.deadline) > new Date() : true);

function PostingCard({ posting, applicants, pendingReview, onEdit }) {
    const open = isOpen(posting);
    const stipend = formatStipend(posting.stipend);
    return (
        <Card className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold leading-snug break-words">{posting.title}</h3>
                    {posting.fieldOfStudy && <p className="text-sm text-text-muted mt-0.5">{posting.fieldOfStudy}</p>}
                </div>
                <Badge tone={open ? 'success' : 'muted'}>{open ? 'Open' : 'Closed'}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-text-muted">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" />{posting.location}{workModeLabel(posting.workMode) ? ` · ${workModeLabel(posting.workMode)}` : ''}</span>
                <span className="flex items-center gap-2"><Wallet className="w-4 h-4 shrink-0" />{stipend ?? 'Stipend not disclosed'}</span>
                <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 shrink-0" />{formatDate(posting.deadline)} <span className="text-text-subtle">({deadlineLabel(posting.deadline)})</span></span>
                <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 shrink-0" />
                    {applicants} applicant{applicants === 1 ? '' : 's'}
                    {pendingReview > 0 && <Badge tone="warning">{pendingReview} to review</Badge>}
                </span>
            </div>

            <div className="mt-5 pt-4 border-t border-ui-border flex flex-wrap gap-2">
                <Button size="sm" variant="primary" icon={Users} to={`/company/applicants?internship=${posting.internshipId}`}>Applicants</Button>
                <Button size="sm" variant="secondary" icon={Pencil} onClick={() => onEdit(posting)}>Edit</Button>
                <Button size="sm" variant="ghost" icon={Eye} to={`/internships/${posting.internshipId}`}>View listing</Button>
            </div>
        </Card>
    );
}

export default function MyCompanyPostingsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const companyId = user?.companyId ?? user?.id;

    const [postings, setPostings] = useState([]);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('all');

    const [editing, setEditing] = useState(null);
    const [values, setValues] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!companyId) return undefined;
        let cancelled = false;
        Promise.all([getInternshipsByCompany(companyId), getCompanyStats(companyId).catch(() => null)])
            .then(([list, stats]) => {
                if (cancelled) return;
                const sorted = (Array.isArray(list) ? [...list] : []).sort(
                    (a, b) => new Date(b.createdAt ?? b.deadline ?? 0) - new Date(a.createdAt ?? a.deadline ?? 0),
                );
                setPostings(sorted);
                setCounts(Object.fromEntries((stats?.postings ?? []).map((p) => [p.internshipId, p])));
            })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load your postings.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [companyId, reloadKey]);

    const retry = () => {
        setLoading(true);
        setError('');
        setReloadKey((k) => k + 1);
    };

    const openCount = postings.filter(isOpen).length;
    const visible = useMemo(() => {
        if (tab === 'open') return postings.filter(isOpen);
        if (tab === 'closed') return postings.filter((p) => !isOpen(p));
        return postings;
    }, [postings, tab]);

    const startEdit = (posting) => {
        setEditing(posting);
        setValues(toFormValues(posting));
        setErrors({});
        setSaveError('');
    };

    const closeEdit = useCallback(() => {
        if (!saving) setEditing(null);
    }, [saving]);

    const originalDeadline = editing?.deadline ? String(editing.deadline).slice(0, 10) : undefined;
    const originalStartDate = editing?.startDate ? String(editing.startDate).slice(0, 10) : undefined;

    const handleSave = async () => {
        const found = validateInternship(values, { originalDeadline, originalStartDate });
        setErrors(found);
        if (Object.keys(found).length > 0) return;
        setSaving(true);
        setSaveError('');
        try {
            const body = { ...editing, ...toPayload(values), internshipId: editing.internshipId, companyId };
            delete body.open; // computed on the server
            const updated = await updateInternship(body);
            setPostings((list) => list.map((p) => (p.internshipId === editing.internshipId ? (updated && typeof updated === 'object' ? updated : body) : p)));
            toast('Posting updated', 'success');
            setEditing(null);
        } catch (err) {
            setSaveError(errorMessage(err, 'Could not save your changes.'));
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { value: 'all', label: 'All', count: postings.length },
        { value: 'open', label: 'Open', count: openCount },
        { value: 'closed', label: 'Closed', count: postings.length - openCount },
    ];

    return (
        <PageContainer>
            <PageHeader
                title="My postings"
                subtitle="Manage your internship listings and jump into applicant review."
                actions={<Button icon={PlusCircle} to="/internships/new">Post internship</Button>}
            />

            {error && (
                <Alert className="mb-6" title="Could not load postings">
                    {error} <button onClick={retry} className="underline font-medium cursor-pointer">Try again</button>
                </Alert>
            )}

            <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-6" />

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((i) => (
                        <Card key={i}><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/3 mt-2" /><Skeleton className="h-16 w-full mt-5" /></Card>
                    ))}
                </div>
            ) : !error && visible.length === 0 ? (
                <Card>
                    {postings.length === 0 ? (
                        <EmptyState
                            icon={Briefcase}
                            title="You have not posted any internships yet"
                            description="Create your first listing to start receiving applications."
                            action={<Button icon={PlusCircle} to="/internships/new">Post an internship</Button>}
                        />
                    ) : (
                        <EmptyState icon={Briefcase} title={tab === 'open' ? 'No open postings' : 'No closed postings'} description="Try another tab." />
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {visible.map((p) => (
                        <PostingCard
                            key={p.internshipId}
                            posting={p}
                            applicants={counts[p.internshipId]?.applicants ?? 0}
                            pendingReview={counts[p.internshipId]?.pendingReview ?? 0}
                            onEdit={startEdit}
                        />
                    ))}
                </div>
            )}

            <Modal
                open={!!editing}
                onClose={closeEdit}
                title="Edit posting"
                description={editing?.title}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={closeEdit} disabled={saving}>Cancel</Button>
                        <Button onClick={handleSave} loading={saving}>Save changes</Button>
                    </>
                }
            >
                {saveError && <Alert className="mb-4">{saveError}</Alert>}
                {Object.keys(errors).length > 0 && <Alert tone="warning" className="mb-4">Please fix the highlighted fields.</Alert>}
                {values && (
                    <InternshipForm values={values} errors={errors} onChange={(next) => { setValues(next); if (Object.keys(errors).length) setErrors(validateInternship(next, { originalDeadline, originalStartDate })); }} plain idPrefix="edit" />
                )}
            </Modal>
        </PageContainer>
    );
}
