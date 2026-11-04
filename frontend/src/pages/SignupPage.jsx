import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, Hash, User, Mail, Briefcase, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../services/apiClient.js';
import { createStudent } from '../services/studentService';
import { createCompany } from '../services/companyService';
import { useToast } from '../components/ui/Toast';
import { Alert, Button, Card, Field, Input, cx } from '../components/ui';
import { AuthLayout, PasswordInput } from '../components/auth/AuthLayout';
import { errorMessage } from '../lib/format';

const ROLES = [
    { value: 'STUDENT', icon: GraduationCap, title: "I'm a student", text: 'Find and apply for internships' },
    { value: 'COMPANY', icon: Building2, title: "I'm an employer", text: 'Post roles and hire interns' },
];

const EMPTY = { studentNumber: '', name: '', companyEmail: '', industry: '', password: '', confirmPassword: '' };

function passwordStrength(pw) {
    if (!pw) return null;
    const score = [pw.length >= 8, /[A-Z]/.test(pw) && /[a-z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
    if (score <= 1) return { label: 'Weak', tone: 'text-rose-600', bar: 'bg-rose-500', width: 'w-1/4' };
    if (score === 2) return { label: 'Fair', tone: 'text-amber-600', bar: 'bg-amber-500', width: 'w-2/4' };
    if (score === 3) return { label: 'Good', tone: 'text-primary-700', bar: 'bg-primary-600', width: 'w-3/4' };
    return { label: 'Strong', tone: 'text-emerald-600', bar: 'bg-emerald-500', width: 'w-full' };
}

const generateCompanyId = () => `COMP-${Date.now().toString(36).toUpperCase()}`;

export default function SignupPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { toast } = useToast();
    const from = location.state?.from?.pathname || '/';

    const [role, setRole] = useState('STUDENT');
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isStudent = role === 'STUDENT';
    const studentEmail = form.studentNumber.trim() ? `${form.studentNumber.trim()}@mycput.ac.za` : '';
    const strength = passwordStrength(form.password);

    const update = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
    };

    const switchRole = (value) => {
        setRole(value);
        setErrors({});
        setError('');
    };

    const validate = () => {
        const er = {};
        if (isStudent && !form.studentNumber.trim()) er.studentNumber = 'Enter your student number.';
        if (!form.name.trim()) er.name = isStudent ? 'Enter your full name.' : 'Enter your company name.';
        if (!isStudent) {
            if (!form.industry.trim()) er.industry = 'Enter your industry.';
            if (!/^\S+@\S+\.\S+$/.test(form.companyEmail.trim())) er.companyEmail = 'Enter a valid email address.';
        }
        if (!form.password) er.password = 'Choose a password.';
        if (form.password !== form.confirmPassword) er.confirmPassword = 'Passwords do not match.';
        if (!consent) er.consent = 'You must accept the POPIA data privacy terms to create an account.';
        setErrors(er);
        return Object.keys(er).length === 0;
    };

    const signIn = async (identifier) => {
        const { data } = await apiClient.post('/auth/login', { identifier, password: form.password });
        if (!data?.token) return false;
        login({
            name: data.name,
            id: data.id,
            studentNumber: data.role === 'STUDENT' ? data.id : undefined,
            companyId: data.role === 'COMPANY' ? data.id : undefined,
            email: data.email,
            role: data.role,
            token: data.token,
        });
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;
        setLoading(true);
        let identifier;
        try {
            if (isStudent) {
                identifier = studentEmail;
                await createStudent({
                    studentNumber: form.studentNumber.trim(),
                    name: form.name.trim(),
                    email: studentEmail,
                    password: form.password,
                    confirmPassword: form.confirmPassword,
                });
            } else {
                identifier = form.companyEmail.trim();
                await createCompany({
                    companyId: generateCompanyId(),
                    name: form.name.trim(),
                    industry: form.industry.trim(),
                    contactEmail: identifier,
                    password: form.password,
                });
            }
        } catch (err) {
            setError(errorMessage(err, 'Registration failed. Please check your details and try again.'));
            setLoading(false);
            return;
        }
        try {
            if (await signIn(identifier)) {
                toast('Welcome to CareerConnect! Your account is ready.', 'success');
                navigate(from, { replace: true });
                return;
            }
            throw new Error('No token');
        } catch {
            toast('Account created. Please sign in to continue.', 'info');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Join CareerConnect today." text="Create a free account in under a minute.">
            <div className="w-full max-w-lg">
                <Card className="sm:!p-8">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-sm text-text-muted mt-1">
                        Already have an account? <Link to="/login" className="font-semibold text-primary-700 hover:underline">Sign in</Link>
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-6" role="radiogroup" aria-label="Account type">
                        {ROLES.map(({ value, icon: Icon, title, text }) => (
                            <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={role === value}
                                onClick={() => switchRole(value)}
                                className={cx(
                                    'text-left rounded-lg border p-3 sm:p-4 transition-colors cursor-pointer',
                                    role === value ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-ui-border hover:border-primary-200',
                                )}
                            >
                                <Icon className={cx('w-5 h-5', role === value ? 'text-primary-600' : 'text-text-subtle')} />
                                <p className="font-semibold text-sm mt-2">{title}</p>
                                <p className="text-xs text-text-muted mt-0.5">{text}</p>
                            </button>
                        ))}
                    </div>

                    {error && <Alert className="mt-5">{error}</Alert>}

                    <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-6">
                        {isStudent ? (
                            <>
                                <Field label="Student number" htmlFor="studentNumber" required error={errors.studentNumber}>
                                    <Input id="studentNumber" name="studentNumber" icon={Hash} value={form.studentNumber} onChange={update} placeholder="e.g. 230480152" autoComplete="username" invalid={!!errors.studentNumber} />
                                </Field>
                                <Field label="Full name" htmlFor="name" required error={errors.name}>
                                    <Input id="name" name="name" icon={User} value={form.name} onChange={update} placeholder="e.g. Thandiwe Mokoena" autoComplete="name" invalid={!!errors.name} />
                                </Field>
                                <Field label="CPUT email" htmlFor="studentEmail" hint="Generated from your student number. Use it or your student number to sign in.">
                                    <Input id="studentEmail" icon={Mail} value={studentEmail} placeholder="studentnumber@mycput.ac.za" disabled readOnly />
                                </Field>
                            </>
                        ) : (
                            <>
                                <Field label="Company name" htmlFor="name" required error={errors.name}>
                                    <Input id="name" name="name" icon={Building2} value={form.name} onChange={update} placeholder="e.g. Takealot Group" autoComplete="organization" invalid={!!errors.name} />
                                </Field>
                                <Field label="Industry" htmlFor="industry" required error={errors.industry}>
                                    <Input id="industry" name="industry" icon={Briefcase} value={form.industry} onChange={update} placeholder="e.g. E-commerce" invalid={!!errors.industry} />
                                </Field>
                                <Field label="Contact email" htmlFor="companyEmail" required error={errors.companyEmail} hint="You will use this email to sign in.">
                                    <Input id="companyEmail" name="companyEmail" type="email" icon={Mail} value={form.companyEmail} onChange={update} placeholder="careers@company.co.za" autoComplete="email" invalid={!!errors.companyEmail} />
                                </Field>
                            </>
                        )}

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Password" htmlFor="password" required error={errors.password}>
                                <PasswordInput id="password" name="password" value={form.password} onChange={update} autoComplete="new-password" invalid={!!errors.password} />
                            </Field>
                            <Field label="Confirm password" htmlFor="confirmPassword" required error={errors.confirmPassword}>
                                <PasswordInput id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={update} autoComplete="new-password" invalid={!!errors.confirmPassword} />
                            </Field>
                        </div>
                        {strength ? (
                            <div className="flex items-center gap-3 -mt-1">
                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div className={cx('h-full rounded-full transition-all', strength.bar, strength.width)} />
                                </div>
                                <span className={cx('text-xs font-medium', strength.tone)}>{strength.label}</span>
                            </div>
                        ) : (
                            <p className="text-xs text-text-muted -mt-1">Use at least 8 characters with a mix of letters, numbers and symbols.</p>
                        )}

                        <div>
                            <label className="flex items-start gap-2.5 text-sm text-text-muted cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={consent}
                                    onChange={(e) => { setConsent(e.target.checked); setErrors((er) => ({ ...er, consent: undefined })); }}
                                    className="mt-0.5 w-4 h-4 rounded border-ui-border accent-primary-600 cursor-pointer"
                                />
                                <span>I consent to CareerConnect processing my personal information in line with POPIA for internship placement purposes.</span>
                            </label>
                            {errors.consent && <p className="text-xs text-rose-600 mt-1.5">{errors.consent}</p>}
                        </div>

                        <Button type="submit" size="lg" className="w-full" loading={loading}>
                            {loading ? 'Creating account...' : <>Create account <ArrowRight className="w-4 h-4" /></>}
                        </Button>
                    </form>
                </Card>
            </div>
        </AuthLayout>
    );
}
