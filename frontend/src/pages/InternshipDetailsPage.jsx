import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { readInternship } from '../services/internshipService';
import { readCompany } from '../services/companyService';
import { applyForInternship, getStudentApplications } from '../services/applicationService';
import {
    Briefcase,
    MapPin,
    Calendar,
    Building2,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ShieldCheck,
    GraduationCap,
    Copy,
} from 'lucide-react';

export default function InternshipDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [internship, setInternship] = useState(null);
    const [company, setCompany] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const job = await readInternship(id);
                if (!job) {
                    setError('The requested internship could not be found.');
                    return;
                }
                setInternship(job);

                if (job.companyId) {
                    try {
                        const compData = await readCompany(job.companyId);
                        setCompany(compData);
                    } catch (compErr) {
                        console.warn('Could not fetch company details:', compErr);
                    }
                }

                // 3. Check if current student has already applied
                if (user?.role === 'STUDENT' && user.studentNumber) {
                    try {
                        const myApps = await getStudentApplications(user.studentNumber);
                        const alreadyApplied = myApps.some(
                            (app) => (app.internship?.internshipId || app.internship?.id) === id
                        );
                        setHasApplied(alreadyApplied);
                    } catch (appErr) {
                        console.warn('Could not check application status:', appErr);
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load internship details. Please ensure the server is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, user]);

    const handleApply = async () => {
        setFeedback(null);

        if (!user) {
            setFeedback({
                type: 'error',
                text: 'Please sign in with your CPUT student account to apply.'
            });
            return;
        }

        if (user.role !== 'STUDENT') {
            setFeedback({
                type: 'error',
                text: 'Only registered CPUT students can apply for WIL internship opportunities.'
            });
            return;
        }

        if (internship.deadline && new Date(internship.deadline) < new Date()) {
            setFeedback({
                type: 'error',
                text: 'Applications for this position have closed.'
            });
            return;
        }

        setApplying(true);
        try {
            await applyForInternship(user.studentNumber, id);
            setHasApplied(true);
            setFeedback({
                type: 'success',
                text: 'Application submitted successfully! The employer can now review your student profile.'
            });
        } catch (err) {
            setFeedback({
                type: 'error',
                text: typeof err === 'string' ? err : 'Failed to submit application. You may have already applied.'
            });
        } finally {
            setApplying(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-5rem)] bg-app-bg flex items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 className="w-9 h-9 animate-spin mx-auto text-brand-accent" />
                    <p className="text-xs text-text-muted">Loading internship details...</p>
                </div>
            </div>
        );
    }

    if (error || !internship) {
        return (
            <div className="min-h-[calc(100vh-5rem)] bg-app-bg p-6 flex items-center justify-center">
                <div className="bg-card-bg border border-ui-border rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
                    <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                    <h2 className="font-heading text-lg font-bold text-text-main">Opportunity Not Available</h2>
                    <p className="text-xs text-text-muted">{error || 'This listing does not exist.'}</p>
                    <Link
                        to="/internships"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Return to Internships</span>
                    </Link>
                </div>
            </div>
        );
    }

    const isExpired = internship.deadline && new Date(internship.deadline) < new Date();
    const companyName = company?.name || 'Verified Industry Partner';
    const companyInitial = companyName.charAt(0).toUpperCase();

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-app-bg p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Breadcrumbs & Back Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/internships')}
                        className="inline-flex items-center space-x-2 text-xs font-semibold text-text-muted hover:text-text-main transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to All Opportunities</span>
                    </button>

                    <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-card-bg hover:bg-slate-50 border border-ui-border rounded-xl text-xs font-semibold text-text-muted hover:text-text-main transition-all cursor-pointer shadow-xs"
                    >
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Link Copied!' : 'Share Opportunity'}</span>
                    </button>
                </div>

                {/* Feedback Banner */}
                {feedback && (
                    <div className={`flex items-center space-x-2 p-4 rounded-2xl text-xs font-medium border shadow-xs ${
                        feedback.type === 'success'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : 'bg-rose-50 text-rose-900 border-rose-200'
                    }`}>
                        {feedback.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{feedback.text}</span>
                    </div>
                )}

                {/* Hero Header Card */}
                <div className="bg-card-bg border border-ui-border rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                        <div className="flex items-start space-x-4">
                            {/* Company Avatar Badge */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0">
                                {companyInitial}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-[10px] bg-brand-primary/10 border border-brand-accent/20 text-brand-accent px-2.5 py-0.5 rounded-full font-semibold">
                                        WIL INTERNSHIP
                                    </span>
                                    {isExpired ? (
                                        <span className="font-mono text-[10px] bg-rose-50 border border-rose-200 text-rose-600 px-2.5 py-0.5 rounded-full font-semibold">
                                            APPLICATIONS CLOSED
                                        </span>
                                    ) : (
                                        <span className="font-mono text-[10px] bg-emerald-50 border border-emerald-200 text-brand-mint px-2.5 py-0.5 rounded-full font-semibold">
                                            ACCEPTING CANDIDATES
                                        </span>
                                    )}
                                </div>

                                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-main leading-tight">
                                    {internship.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-text-muted pt-1">
                                    <div className="flex items-center space-x-1.5">
                                        <Building2 className="w-4 h-4 text-brand-accent" />
                                        <span className="font-semibold text-text-main">{companyName}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <MapPin className="w-4 h-4 text-text-subtle" />
                                        <span>{internship.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5 font-mono">
                                        <Calendar className="w-4 h-4 text-amber-500" />
                                        <span>Deadline: {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'Rolling'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Direct Action for Desktop */}
                        <div className="hidden sm:block shrink-0">
                            {hasApplied ? (
                                <div className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Application Submitted</span>
                                </div>
                            ) : isExpired ? (
                                <div className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-app-bg text-text-subtle border border-ui-border">
                                    Deadline Expired
                                </div>
                            ) : (
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer flex items-center space-x-2 disabled:opacity-75"
                                >
                                    {applying ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Submitting Profile...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Apply with Student Profile</span>
                                            <Briefcase className="w-3.5 h-3.5" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Two-Column Handshake Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column (8 cols): Job Description & WIL Info */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Position Description */}
                        <div className="bg-card-bg border border-ui-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                            <h2 className="font-heading text-lg font-bold text-text-main">
                                Role Overview & Responsibilities
                            </h2>
                            <div className="text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-line space-y-3">
                                {internship.description}
                            </div>
                        </div>

                        {/* CPUT WIL Academic Requirements Notice */}
                        <div className="bg-card-bg border border-ui-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                            <div className="flex items-center space-x-2 text-brand-primary">
                                <GraduationCap className="w-5 h-5 text-brand-accent" />
                                <h3 className="font-heading text-base font-bold text-text-main">
                                    CPUT WIL Credit Information
                                </h3>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed">
                                This opportunity qualifies for Work-Integrated Learning (WIL) academic credit for Diploma and Advanced Diploma students within the Faculty of Informatics and Design. Successful placement will be recorded against your student PRT/PRP progress.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="p-3 bg-app-bg border border-ui-border rounded-xl text-xs space-y-1">
                                    <span className="font-bold text-text-main block">Eligible Cohorts</span>
                                    <span className="text-text-muted text-[11px]">Applications Development (ADP372S / PRT362S / PRP372S)</span>
                                </div>
                                <div className="p-3 bg-app-bg border border-ui-border rounded-xl text-xs space-y-1">
                                    <span className="font-bold text-text-main block">Verification Status</span>
                                    <span className="text-brand-mint text-[11px] font-semibold flex items-center space-x-1">
                                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                        <span>Industry Partner Verified</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (4 cols): Sticky Action & Employer Profile Card */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Sticky Action Card */}
                        <div className="bg-card-bg border border-ui-border rounded-3xl p-6 shadow-sm space-y-5 sticky top-24">
                            <h3 className="font-heading text-sm font-bold text-text-main border-b border-ui-border pb-3">
                                Application Summary
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between items-center text-text-muted">
                                    <span>Listing Reference:</span>
                                    <span className="font-mono text-[11px] text-text-main font-semibold">
                                        {internship.internshipId}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-text-muted">
                                    <span>Location:</span>
                                    <span className="text-text-main font-semibold">{internship.location}</span>
                                </div>
                                <div className="flex justify-between items-center text-text-muted">
                                    <span>Application Deadline:</span>
                                    <span className="text-text-main font-semibold font-mono">
                                        {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'Open until filled'}
                                    </span>
                                </div>
                            </div>

                            {/* Button */}
                            <div className="pt-2">
                                {hasApplied ? (
                                    <div className="w-full py-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 text-center flex items-center justify-center space-x-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>Application Submitted</span>
                                    </div>
                                ) : isExpired ? (
                                    <div className="w-full py-3 rounded-xl text-xs font-semibold bg-app-bg text-text-subtle border border-ui-border text-center">
                                        Listing Closed
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleApply}
                                        disabled={applying}
                                        className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl shadow-md transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-75"
                                    >
                                        {applying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Submitting Application...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Apply for Position</span>
                                                <Briefcase className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Employer Card Mini */}
                            {company && (
                                <div className="pt-4 border-t border-ui-border space-y-3">
                                    <span className="font-mono text-[10px] text-text-muted uppercase font-bold tracking-wider">
                                        About the Employer
                                    </span>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-accent flex items-center justify-center font-bold text-xs">
                                            {companyInitial}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs text-text-main">{company.name}</h4>
                                            <p className="text-[11px] text-text-muted">{company.industry}</p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-text-muted leading-tight font-mono">
                                        Contact: {company.contactEmail}
                                    </p>
                                </div>
                            )}

                            {/* Trust Badge */}
                            <div className="p-3 bg-app-bg rounded-xl border border-ui-border text-[11px] text-text-muted flex items-start space-x-2">
                                <ShieldCheck className="w-4 h-4 text-brand-mint shrink-0 mt-0.5" />
                                <span>All applications submitted through CareerConnect are directly forwarded to verified corporate hiring managers.</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}