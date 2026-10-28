import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    GraduationCap,
    Mail,
    Lock,
    ArrowRight,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { useAuth } from "../context/AuthContext.jsx";
import apiClient from "../services/apiClient.js";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/login', {
                identifier: credentials.email.trim(),
                password: credentials.password
            });

            const authData = response.data;

            if (authData && authData.token) {
                // Multi-role session storage mapped cleanly from universal authData.id
                login({
                    name: authData.name,
                    id: authData.id,
                    studentNumber: authData.role === 'STUDENT' ? authData.id : undefined,
                    companyId: authData.role === 'COMPANY' ? authData.id : undefined,
                    adminId: authData.role === 'ADMIN' ? authData.id : undefined,
                    email: authData.email,
                    role: authData.role,
                    token: authData.token
                });

                navigate(from, { replace: true });
            }
        } catch (err) {
            const errorMsg = err.response?.data || 'Invalid credentials. Please verify your details.';
            setError(typeof errorMsg === 'string' ? errorMsg : 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-app-bg flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md bg-card-bg/90 border border-ui-border rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-xl">

                {/* Header Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-brand-primary/20 border border-brand-accent/30 p-3 rounded-2xl text-brand-accent mb-4">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold text-text-main">Welcome Back</h1>
                    <p className="text-text-muted text-xs mt-1">Sign in to your CareerConnect account</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 text-rose-900 p-3.5 rounded-xl text-xs font-semibold shadow-sm mb-6">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email / Identifier Input */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1.5">
                            Email or Student Number / Identifier
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                name="email"
                                value={credentials.email}
                                autoComplete="off"
                                onChange={handleChange}
                                placeholder="240456890 or hr@company.co.za"
                                required
                                className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-semibold text-text-muted">Password</label>
                            <a href="#" className="text-[11px] text-brand-accent hover:underline font-medium">
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all font-mono"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 mt-2 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Signing In...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 pt-6 border-t border-ui-border text-center">
                    <p className="text-xs text-text-muted">
                        Don't have an account yet?{' '}
                        <Link to="/signup" className="text-brand-accent font-semibold hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}