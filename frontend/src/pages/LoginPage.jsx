import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../services/apiClient.js';
import { Alert, Button, Card, Field, Input, cx } from '../components/ui';
import { AuthLayout, PasswordInput } from '../components/auth/AuthLayout';
import { errorMessage } from '../lib/format';

const DEMO_ACCOUNTS = [
    { role: 'Student', identifier: '230480152@mycput.ac.za', password: 'Demo@1234' },
    { role: 'Employer', identifier: 'careers@takealot.demo', password: 'Demo@1234' },
    { role: 'Admin', identifier: 'admin@cput.ac.za', password: 'adminpass123' },
];

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const from = location.state?.from?.pathname || '/';

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showDemo, setShowDemo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await apiClient.post('/auth/login', { identifier: identifier.trim(), password });
            if (!data?.token) throw new Error('Authentication failed.');
            login({
                name: data.name,
                id: data.id,
                studentNumber: data.role === 'STUDENT' ? data.id : undefined,
                companyId: data.role === 'COMPANY' ? data.id : undefined,
                adminId: data.role === 'ADMIN' ? data.id : undefined,
                email: data.email,
                role: data.role,
                token: data.token,
            });
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response
                ? errorMessage(err, 'Invalid credentials. Please check your details.')
                : 'Could not reach the server. Please try again shortly.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (account) => {
        setIdentifier(account.identifier);
        setPassword(account.password);
        setError('');
    };

    return (
        <AuthLayout title="Launch your career with the right internship." text="Sign in to pick up where you left off.">
            <div className="w-full max-w-md">
                <Card className="sm:!p-8">
                    <h1 className="text-2xl font-bold">Sign in</h1>
                    <p className="text-sm text-text-muted mt-1">Welcome back to CareerConnect.</p>

                    {error && <Alert className="mt-5">{error}</Alert>}

                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        <Field label="Email or student number" htmlFor="identifier">
                            <Input
                                id="identifier"
                                icon={Mail}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="230480152 or you@company.co.za"
                                autoComplete="username"
                                required
                            />
                        </Field>
                        <Field label="Password" htmlFor="password">
                            <PasswordInput
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                        </Field>
                        <Button type="submit" size="lg" className="w-full" loading={loading}>
                            {loading ? 'Signing in...' : <>Sign in <ArrowRight className="w-4 h-4" /></>}
                        </Button>
                    </form>

                    <p className="text-sm text-text-muted text-center mt-6">
                        New to CareerConnect?{' '}
                        <Link to="/signup" className="font-semibold text-primary-700 hover:underline">Create an account</Link>
                    </p>
                </Card>

                <div className="mt-4 rounded-xl border border-ui-border bg-card-bg">
                    <button
                        type="button"
                        onClick={() => setShowDemo((s) => !s)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium cursor-pointer"
                        aria-expanded={showDemo}
                    >
                        Demo accounts
                        <ChevronDown className={cx('w-4 h-4 text-text-muted transition-transform', showDemo && 'rotate-180')} />
                    </button>
                    {showDemo && (
                        <div className="px-4 pb-4 space-y-2">
                            <p className="text-xs text-text-muted">Click an account to fill in its credentials, then sign in.</p>
                            {DEMO_ACCOUNTS.map((a) => (
                                <button
                                    key={a.role}
                                    type="button"
                                    onClick={() => fillDemo(a)}
                                    className="w-full flex items-center justify-between gap-3 rounded-lg border border-ui-border px-3 py-2 text-left text-sm hover:border-primary-300 hover:bg-primary-50 cursor-pointer"
                                >
                                    <span className="font-medium">{a.role}</span>
                                    <span className="text-text-muted truncate">{a.identifier}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthLayout>
    );
}
