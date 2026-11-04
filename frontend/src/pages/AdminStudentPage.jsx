import { useEffect, useMemo, useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { TableToolbar, RowActions, FormModal } from '../components/admin/AdminKit';
import { getAllStudents, createStudent, updateStudent, deleteStudent } from '../services/studentService';
import { getAllApplications } from '../services/applicationService';
import { useToast } from '../components/ui/Toast';
import {
    PageContainer, PageHeader, Card, Table, Button, Input, Field, Modal, ConfirmDialog, EmptyState, Spinner, Alert, Avatar, StatusBadge,
} from '../components/ui';
import { formatDate, errorMessage } from '../lib/format';

const EMPTY_NEW = { studentNumber: '', name: '', password: '', confirmPassword: '' };

export default function AdminStudentPage() {
    const { toast } = useToast();
    const [students, setStudents] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    const [viewing, setViewing] = useState(null);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [adding, setAdding] = useState(false);
    const [newStudent, setNewStudent] = useState(EMPTY_NEW);
    const [formError, setFormError] = useState('');
    const [busy, setBusy] = useState(false);

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        Promise.all([getAllStudents(), getAllApplications().catch(() => [])])
            .then(([s, apps]) => {
                if (cancelled) return;
                setStudents(s || []);
                setApplications(apps || []);
            })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load students.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [reloadKey]);

    const load = () => {
        setLoading(true);
        setError('');
        setReloadKey((k) => k + 1);
    };

    const appsByStudent = useMemo(() => {
        const map = {};
        applications.forEach((a) => {
            const key = a.student?.studentNumber;
            if (key) (map[key] ||= []).push(a);
        });
        return map;
    }, [applications]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return students
            .filter((s) => !q || [s.studentNumber, s.name, s.email].some((v) => (v || '').toLowerCase().includes(q)))
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [students, query]);

    const closeForms = () => { setAdding(false); setEditing(null); setFormError(''); };

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');
        if (newStudent.password !== newStudent.confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }
        setBusy(true);
        try {
            const studentNumber = newStudent.studentNumber.trim();
            await createStudent({
                studentNumber,
                name: newStudent.name.trim(),
                email: `${studentNumber}@mycput.ac.za`,
                password: newStudent.password,
                confirmPassword: newStudent.confirmPassword,
            });
            toast(`Student ${studentNumber} registered`, 'success');
            setNewStudent(EMPTY_NEW);
            closeForms();
            load();
        } catch (err) {
            setFormError(errorMessage(err, 'Registration failed. The student number may already exist.'));
        } finally {
            setBusy(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setFormError('');
        setBusy(true);
        try {
            const updated = await updateStudent(editing);
            setStudents((list) => list.map((s) => (s.studentNumber === updated.studentNumber ? { ...s, ...updated } : s)));
            toast('Student details updated', 'success');
            closeForms();
        } catch (err) {
            setFormError(errorMessage(err, 'Could not update the student.'));
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        setBusy(true);
        try {
            await deleteStudent(deleting.studentNumber);
            setStudents((list) => list.filter((s) => s.studentNumber !== deleting.studentNumber));
            toast(`${deleting.name} was removed`, 'success');
            setDeleting(null);
        } catch (err) {
            toast(errorMessage(err, 'Could not delete the student.'), 'error');
        } finally {
            setBusy(false);
        }
    };

    const columns = [
        { key: 'name', header: 'Student', render: (s) => (
            <div className="flex items-center gap-3">
                <Avatar name={s.name} size="sm" />
                <span className="font-medium">{s.name}</span>
            </div>
        ) },
        { key: 'studentNumber', header: 'Student number' },
        { key: 'email', header: 'Email', className: 'hidden md:table-cell text-text-muted' },
        { key: 'apps', header: 'Applications', className: 'text-center', render: (s) => appsByStudent[s.studentNumber]?.length ?? 0 },
        { key: 'actions', header: <span className="sr-only">Actions</span>, className: 'text-right whitespace-nowrap', render: (s) => (
            <RowActions
                onView={() => setViewing(s)}
                onEdit={() => setEditing({ studentNumber: s.studentNumber, name: s.name, email: s.email })}
                onDelete={() => setDeleting(s)}
            />
        ) },
    ];

    const viewingApps = viewing ? appsByStudent[viewing.studentNumber] ?? [] : [];

    return (
        <PageContainer>
            <PageHeader
                title="Students"
                subtitle="Registered student accounts on CareerConnect"
                actions={<Button icon={UserPlus} onClick={() => { setFormError(''); setAdding(true); }}>Add student</Button>}
            />

            <Card padding={false}>
                <TableToolbar query={query} onQuery={setQuery} placeholder="Search by name, number or email" shown={filtered.length} total={students.length} noun="students" />
                {loading ? <Spinner label="Loading students..." /> : error ? (
                    <div className="p-4"><Alert title="Could not load students">{error}</Alert></div>
                ) : (
                    <Table
                        columns={columns}
                        rows={filtered}
                        rowKey={(s) => s.studentNumber}
                        empty={<EmptyState icon={Users} title={query ? 'No matching students' : 'No students yet'} description={query ? 'Try a different search term.' : 'Students appear here once they sign up.'} />}
                    />
                )}
            </Card>

            <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name} description={viewing?.email} size="lg">
                {viewing && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar name={viewing.name} size="lg" />
                            <div className="text-sm">
                                <p><span className="text-text-muted">Student number:</span> {viewing.studentNumber}</p>
                                <p><span className="text-text-muted">Applications:</span> {viewingApps.length}</p>
                            </div>
                        </div>
                        {viewingApps.length === 0 ? (
                            <p className="text-sm text-text-muted">This student has not applied for any internships yet.</p>
                        ) : (
                            <ul className="divide-y divide-ui-border border border-ui-border rounded-lg">
                                {viewingApps.map((a) => (
                                    <li key={a.applicationId} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{a.internship?.title}</p>
                                            <p className="text-text-muted">{a.internship?.companyName} · {formatDate(a.dateApplied)}</p>
                                        </div>
                                        <StatusBadge status={a.status} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </Modal>

            <FormModal open={!!editing} onClose={closeForms} title="Edit student" description={editing?.studentNumber} formId="edit-student" onSubmit={handleUpdate} submitLabel="Save changes" busy={busy}>
                {formError && <Alert>{formError}</Alert>}
                <Field label="Full name" htmlFor="es-name" required>
                    <Input id="es-name" required value={editing?.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </Field>
                <Field label="Email" htmlFor="es-email" required>
                    <Input id="es-email" type="email" required value={editing?.email ?? ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
                </Field>
            </FormModal>

            <FormModal open={adding} onClose={closeForms} title="Add student" description="The CPUT email address is generated from the student number." formId="add-student" onSubmit={handleCreate} submitLabel="Create account" busy={busy}>
                {formError && <Alert>{formError}</Alert>}
                <Field label="Student number" htmlFor="ns-num" required hint={newStudent.studentNumber.trim() ? `Email: ${newStudent.studentNumber.trim()}@mycput.ac.za` : undefined}>
                    <Input id="ns-num" required value={newStudent.studentNumber} onChange={(e) => setNewStudent({ ...newStudent, studentNumber: e.target.value })} placeholder="e.g. 230480152" />
                </Field>
                <Field label="Full name" htmlFor="ns-name" required>
                    <Input id="ns-name" required value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Password" htmlFor="ns-pw" required>
                        <Input id="ns-pw" type="password" required value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} />
                    </Field>
                    <Field label="Confirm password" htmlFor="ns-pw2" required>
                        <Input id="ns-pw2" type="password" required value={newStudent.confirmPassword} onChange={(e) => setNewStudent({ ...newStudent, confirmPassword: e.target.value })} />
                    </Field>
                </div>
            </FormModal>

            <ConfirmDialog
                open={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={handleDelete}
                loading={busy}
                title="Delete student?"
                message={deleting ? `This permanently removes ${deleting.name} (${deleting.studentNumber}) and cannot be undone.` : ''}
                confirmLabel="Delete student"
            />
        </PageContainer>
    );
}
