import { useEffect, useState } from 'react';
import { Briefcase, Building2, KeyRound, Mail, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { readCompany, updateCompany } from '../services/companyService';
import { getInternshipsByCompany } from '../services/internshipService';
import { useToast } from '../components/ui/Toast';
import {
    Alert, Button, Card, CardHeader, CompanyLogo, Field, Input, PageContainer, PageHeader, Skeleton,
} from '../components/ui';
import { errorMessage } from '../lib/format';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toForm = (c) => ({ name: c?.name ?? '', industry: c?.industry ?? '', contactEmail: c?.contactEmail ?? '' });

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3">
            <Icon className="w-5 h-5 text-text-subtle mt-0.5 shrink-0" />
            <div className="min-w-0">
                <dt className="text-sm text-text-muted">{label}</dt>
                <dd className="font-medium break-words">{value || '—'}</dd>
            </div>
        </div>
    );
}

export default function CompanyProfilePage() {
    const { user, login } = useAuth();
    const { toast } = useToast();
    const companyId = user?.companyId ?? user?.id;

    const [company, setCompany] = useState(null);
    const [openCount, setOpenCount] = useState(null);
    const [totalCount, setTotalCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(toForm(null));
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [savingPassword, setSavingPassword] = useState(false);

    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!companyId) return undefined;
        let cancelled = false;
        Promise.all([readCompany(companyId), getInternshipsByCompany(companyId).catch(() => null)])
            .then(([c, postings]) => {
                if (cancelled) return;
                setCompany(c);
                setForm(toForm(c));
                if (Array.isArray(postings)) {
                    setTotalCount(postings.length);
                    setOpenCount(postings.filter((p) => (typeof p.open === 'boolean' ? p.open : new Date(p.deadline) > new Date())).length);
                }
            })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load your company profile.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [companyId, reloadKey]);

    const retry = () => {
        setLoading(true);
        setError('');
        setReloadKey((k) => k + 1);
    };

    const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!form.name.trim()) errs.name = 'Company name is required.';
        if (!form.industry.trim()) errs.industry = 'Industry is required.';
        if (!EMAIL_RE.test(form.contactEmail.trim())) errs.contactEmail = 'Enter a valid email address.';
        setFormErrors(errs);
        if (Object.keys(errs).length) return;

        setSaving(true);
        try {
            // Password is omitted so the backend keeps the existing hash.
            const result = await updateCompany({
                companyId: company?.companyId ?? companyId,
                name: form.name.trim(),
                industry: form.industry.trim(),
                contactEmail: form.contactEmail.trim(),
            });
            if (!result) throw new Error('The server did not accept the update.');
            setCompany(result);
            setForm(toForm(result));
            login({ ...user, name: result.name, email: result.contactEmail });
            setEditing(false);
            toast('Company profile updated', 'success');
        } catch (err) {
            toast(errorMessage(err, 'Could not update your profile.'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePassword = async (e) => {
        e.preventDefault();
        const errs = {};
        if (passwords.newPassword.length < 8) errs.newPassword = 'Use at least 8 characters.';
        if (passwords.confirmPassword !== passwords.newPassword) errs.confirmPassword = 'Passwords do not match.';
        setPasswordErrors(errs);
        if (Object.keys(errs).length) return;

        setSavingPassword(true);
        try {
            const result = await updateCompany({
                companyId: company?.companyId ?? companyId,
                name: company?.name,
                industry: company?.industry,
                contactEmail: company?.contactEmail,
                password: passwords.newPassword,
            });
            if (!result) throw new Error('The server did not accept the update.');
            setPasswords({ newPassword: '', confirmPassword: '' });
            toast('Password changed', 'success');
        } catch (err) {
            toast(errorMessage(err, 'Could not change your password.'), 'error');
        } finally {
            setSavingPassword(false);
        }
    };

    const cancelEdit = () => {
        setForm(toForm(company));
        setFormErrors({});
        setEditing(false);
    };

    return (
        <PageContainer>
            <div className="max-w-4xl">
            <PageHeader title="Company profile" subtitle="This information is shown to students on your listings." />

            {error && (
                <Alert className="mb-6" title="Could not load profile">
                    {error} <button onClick={retry} className="underline font-medium cursor-pointer">Try again</button>
                </Alert>
            )}

            {loading ? (
                <div className="space-y-6">
                    <Card className="flex items-center gap-4"><Skeleton className="w-16 h-16 rounded-lg" /><div className="flex-1 space-y-2"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-4 w-1/4" /></div></Card>
                    <Card><Skeleton className="h-5 w-40 mb-4" /><Skeleton className="h-24 w-full" /></Card>
                </div>
            ) : company && (
                <div className="space-y-6">
                    <Card className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <CompanyLogo name={company.name} size="lg" />
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-bold break-words">{company.name}</h2>
                            <p className="text-text-muted">{company.industry}</p>
                        </div>
                        <div className="flex gap-6 sm:text-right">
                            <div>
                                <p className="text-2xl font-bold">{openCount ?? '—'}</p>
                                <p className="text-sm text-text-muted">Open internships</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalCount ?? '—'}</p>
                                <p className="text-sm text-text-muted">Total postings</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader
                            title="Company details"
                            subtitle="Name, industry and the email students and admins can reach you on"
                            action={!editing && <Button size="sm" variant="secondary" icon={Pencil} onClick={() => setEditing(true)}>Edit</Button>}
                        />
                        {editing ? (
                            <form onSubmit={handleSave} noValidate className="space-y-4">
                                <Field label="Company name" htmlFor="cp-name" error={formErrors.name} required>
                                    <Input id="cp-name" value={form.name} onChange={setField('name')} invalid={!!formErrors.name} />
                                </Field>
                                <Field label="Industry" htmlFor="cp-industry" error={formErrors.industry} required>
                                    <Input id="cp-industry" value={form.industry} onChange={setField('industry')} invalid={!!formErrors.industry} placeholder="e.g. E-commerce" />
                                </Field>
                                <Field label="Contact email" htmlFor="cp-email" error={formErrors.contactEmail} hint="You also sign in with this email." required>
                                    <Input id="cp-email" type="email" value={form.contactEmail} onChange={setField('contactEmail')} invalid={!!formErrors.contactEmail} />
                                </Field>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="secondary" onClick={cancelEdit} disabled={saving}>Cancel</Button>
                                    <Button type="submit" loading={saving}>Save changes</Button>
                                </div>
                            </form>
                        ) : (
                            <dl className="divide-y divide-ui-border -my-3">
                                <DetailRow icon={Building2} label="Company name" value={company.name} />
                                <DetailRow icon={Briefcase} label="Industry" value={company.industry} />
                                <DetailRow icon={Mail} label="Contact email" value={company.contactEmail} />
                                <DetailRow icon={KeyRound} label="Company ID" value={company.companyId} />
                            </dl>
                        )}
                    </Card>

                    <Card>
                        <CardHeader title="Change password" subtitle="Choose a strong password of at least 8 characters" />
                        <form onSubmit={handlePassword} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="New password" htmlFor="cp-new" error={passwordErrors.newPassword}>
                                <Input id="cp-new" type="password" autoComplete="new-password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} invalid={!!passwordErrors.newPassword} />
                            </Field>
                            <Field label="Confirm new password" htmlFor="cp-confirm" error={passwordErrors.confirmPassword}>
                                <Input id="cp-confirm" type="password" autoComplete="new-password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} invalid={!!passwordErrors.confirmPassword} />
                            </Field>
                            <div className="sm:col-span-2 flex justify-end">
                                <Button type="submit" variant="secondary" loading={savingPassword} disabled={!passwords.newPassword}>Update password</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
            </div>
        </PageContainer>
    );
}
