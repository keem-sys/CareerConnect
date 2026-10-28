import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    GraduationCap,
    User,
    Mail,
    Lock,
    Hash,
    Building2,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Briefcase,
    Eye,
    EyeOff,
} from 'lucide-react';
import { createStudent } from '../services/studentService';
import { useAuth } from '../context/AuthContext';
import { createCompany } from '../services/companyService';
import apiClient from "../services/apiClient.js";

export default function SignupPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [role, setRole] = useState('STUDENT');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [popiaConsent, setPopiaConsent] = useState(false);

    const [formData, setFormData] = useState({
        studentNumber: '',
        name: '',
        password: '',
        confirmPassword: '',
        companyId: '',
        companyEmail: '',
        industry: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!popiaConsent) {
            setError('You must accept the POPIA data privacy terms to create an account.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please verify your password.');
            return;
        }

        setLoading(true);

        try {
            if (role === 'STUDENT') {
                const generatedCputEmail = `${formData.studentNumber.trim()}@mycput.ac.za`;

                const studentPayload = {
                    studentNumber: formData.studentNumber.trim(),
                    name: formData.name.trim(),
                    email: generatedCputEmail,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                };

                await createStudent(studentPayload);

                const loginResponse = await apiClient.post('/auth/login', {
                    identifier: generatedCputEmail,
                    password: formData.password
                });

                const authData = loginResponse.data;
                if (authData && authData.token) {
                    login({
                        name: authData.name,
                        id: authData.id,
                        studentNumber: authData.id, // Mapped universally from authData.id
                        email: authData.email,
                        role: authData.role,
                        token: authData.token
                    });
                    navigate(from, { replace: true });
                } else {
                    setError('Registration succeeded, but auto-login failed. Please sign in manually.');
                    navigate('/login');
                }

            } else {
                const companyPayload = {
                    companyId: formData.companyId.trim(),
                    name: formData.name.trim(),
                    industry: formData.industry.trim(),
                    contactEmail: formData.companyEmail.trim(),
                    password: formData.password
                };

                await createCompany(companyPayload);

                const loginResponse = await apiClient.post('/auth/login', {
                    identifier: formData.companyEmail.trim(),
                    password: formData.password
                });

                const authData = loginResponse.data;
                if (authData && authData.token) {
                    login({
                        name: authData.name,
                        id: authData.id,
                        companyId: authData.id, // Mapped universally from authData.id for companies
                        email: authData.email,
                        role: authData.role,
                        token: authData.token
                    });
                    navigate(from, { replace: true });
                } else {
                    setError('Registration succeeded, but auto-login failed. Please sign in manually.');
                    navigate('/login');
                }
            }
        } catch (err) {
            const errorMsg = err.response?.data || 'Could not connect to Spring Boot backend. Ensure server is running.';
            setError(typeof errorMsg === 'string' ? errorMsg : 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-app-bg flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl bg-card-bg/90 border border-ui-border rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl">

                {/* LEFT COLUMN: Hero & Branding Banner */}
                <div className="lg:col-span-5 bg-gradient-to-br from-brand-primary/10 via-card-bg to-brand-accent/5 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-ui-border relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-6">
                        <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/30 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-semibold">
                            <GraduationCap className="w-4 h-4" />
                            <span>{role === 'STUDENT' ? 'CPUT Student Portal' : 'Employer Recruitment Portal'}</span>
                        </div>

                        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight leading-tight">
                            {role === 'STUDENT'
                                ? 'Start Your Journey to Industry Success'
                                : 'Recruit Top CPUT Tech Talent'}
                        </h1>

                        <p className="text-text-muted text-sm leading-relaxed">
                            {role === 'STUDENT'
                                ? 'Connect directly with top tech companies, apply for verified CPUT Work-Integrated Learning (WIL) internships, and track your applications in real-time.'
                                : 'Partner with CPUT to post WIL internship opportunities, review verified student developer profiles, and hire top-tier tech talent.'}
                        </p>

                        {/* Dynamic Checkpoints */}
                        <div className="space-y-3 pt-2">
                            {role === 'STUDENT' ? (
                                <>
                                    <div className="flex items-center space-x-3 text-text-main text-xs font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                                        <span>Verified CPUT Internship Postings</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-text-main text-xs font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                                        <span>Direct Employer Recruitment</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-text-main text-xs font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                                        <span>Real-Time Status Tracking</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-3 text-text-main text-xs font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                                        <span>Access Vetted CPUT IT Talent</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-text-main text-xs font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                                        <span>Post WIL Internship Listings</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-text-main text-xs font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                                        <span>Direct Candidate Applications</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-ui-border">
                        <p className="text-xs text-text-muted">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brand-accent font-semibold hover:underline">
                                Sign In here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Role-Based Registration Form */}
                <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">

                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="font-heading text-2xl font-bold text-text-main">Create Account</h2>
                        <p className="text-text-muted text-xs mt-1">Select your role to view relevant registration fields</p>
                    </div>

                    {/* Role Toggle Tabs */}
                    <div className="grid grid-cols-2 gap-2 bg-app-bg p-1.5 rounded-2xl border border-ui-border mb-6">
                        <button
                            type="button"
                            onClick={() => { setRole('STUDENT'); setError(''); }}
                            className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                role === 'STUDENT'
                                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                                    : 'text-text-muted hover:text-text-main'
                            }`}
                        >
                            <User className="w-3.5 h-3.5" />
                            <span>CPUT Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setRole('COMPANY'); setError(''); }}
                            className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                role === 'COMPANY'
                                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                                    : 'text-text-muted hover:text-text-main'
                            }`}
                        >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Employer / Company</span>
                        </button>
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

                        {/* STUDENT FORM FIELDS */}
                        {role === 'STUDENT' ? (
                            <>
                                {/* Student Number Input + Live Email Preview Badge */}
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted mb-1.5">
                                        CPUT Student Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                                            <Hash className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            name="studentNumber"
                                            value={formData.studentNumber}
                                            onChange={handleChange}
                                            placeholder="e.g. 240456890"
                                            autoComplete="username"
                                            required
                                            className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all font-mono"
                                        />
                                    </div>

                                    {/* Live CPUT Email Preview Badge */}
                                    {formData.studentNumber.trim() && (
                                        <div className="mt-2 flex items-center space-x-2 text-[11px] text-brand-mint bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-mono">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span>Official CPUT Email: <strong>{formData.studentNumber.trim()}@mycput.ac.za</strong></span>
                                        </div>
                                    )}
                                </div>

                                {/* Student Full Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Thamiso Tandeke"
                                            autoComplete="name"
                                            required
                                            className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* EMPLOYER FORM FIELDS */
                            <>
                                {/* Company Registration ID */}
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted mb-1.5">
                                        Company Registration ID
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                                            <Hash className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            name="companyId"
                                            value={formData.companyId}
                                            onChange={handleChange}
                                            placeholder="e.g. C001"
                                            autoComplete="username"
                                            required
                                            className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Company Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted mb-1.5">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. TechNova Systems"
                                            autoComplete="name"
                                            required
                                            className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main"
                                        />
                                    </div>
                                </div>

                                {/* Corporate Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Corporate Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            name="companyEmail"
                                            value={formData.companyEmail}
                                            onChange={handleChange}
                                            placeholder="e.g. hr@technova.co.za"
                                            autoComplete="email"
                                            required
                                            className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main"
                                        />
                                    </div>
                                </div>

                                {/* Industry Field */}
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Industry Sector</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            placeholder="e.g. Software Development"
                                            required
                                            className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    required
                                    className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-10 py-2.5 text-xs text-text-main font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-main cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    required
                                    className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-10 py-2.5 text-xs text-text-main font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-main cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* POPIA Consent Checkbox */}
                        <div className="pt-2">
                            <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={popiaConsent}
                                    onChange={(e) => setPopiaConsent(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 text-brand-primary border-ui-border rounded focus:ring-brand-accent cursor-pointer"
                                />
                                <span className="text-[11px] text-text-muted leading-tight">
                                    I consent to CareerConnect processing my personal and academic data for recruitments in accordance with the <strong>Protection of Personal Information Act (POPIA)</strong>.
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 mt-3 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Registering...</span>
                                </>
                            ) : (
                                <>
                                    <span>Complete Registration</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                </div>

            </div>
        </div>
    );
}