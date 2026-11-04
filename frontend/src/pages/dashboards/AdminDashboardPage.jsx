import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Building2,
    Briefcase,
    ShieldCheck,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext.jsx";
import { getAllStudents } from '../../services/studentService';
import { getAllCompanies } from '../../services/companyService';
import { getAllInternships } from '../../services/internshipService';

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [studentCount, setStudentCount] = useState(0);
    const [companyCount, setCompanyCount] = useState(0);
    const [internshipCount, setInternshipCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const [students, companies, internships] = await Promise.all([
                    getAllStudents(),
                    getAllCompanies(),
                    getAllInternships()
                ]);
                setStudentCount(students?.length || 0);
                setCompanyCount(companies?.length || 0);
                setInternshipCount(internships?.length || 0);
            } catch (err) {
                console.error("Failed to load admin global metrics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

            {/* Header Banner */}
            <div className="bg-card-bg border border-ui-border rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-600 text-xs font-mono font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>ADMINISTRATOR CONTROL PANEL</span>
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-main">
                        System Overview, {user?.name} 🛡️
                    </h1>
                    <p className="text-text-muted text-xs sm:text-sm max-w-2xl">
                        Manage student accounts, verify employer registrations, and oversee all active platform internship postings.
                    </p>
                </div>
            </div>

            {/* TIER 1: LIVE DATABASE STAT METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Students Metric */}
                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Registered Students</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin inline text-brand-accent" /> : `${studentCount} Students`}
                        </h3>
                    </div>
                </div>

                {/* Companies Metric */}
                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Registered Companies</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin inline text-amber-600" /> : `${companyCount} Partners`}
                        </h3>
                    </div>
                </div>

                {/* Internships Metric */}
                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-emerald-50 text-brand-mint border border-emerald-200 rounded-xl">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Global Internships</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin inline text-brand-mint" /> : `${internshipCount} Active`}
                        </h3>
                    </div>
                </div>

            </div>

            {/* TIER 2: MANAGEMENT & GOVERNANCE QUICK ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Student Directory Link */}
                <div className="bg-card-bg border border-ui-border p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:border-brand-accent/40 transition-all">
                    <div>
                        <div className="w-10 h-10 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-xl flex items-center justify-center mb-3">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="font-heading text-base font-bold text-text-main mb-1">Student Directory</h3>
                        <p className="text-text-muted text-xs leading-relaxed">Search, inspect, and manage student accounts in the database.</p>
                    </div>
                    <Link
                        to="/admin/students"
                        className="mt-4 inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-accent hover:underline"
                    >
                        <span>Manage Students</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* 2. Company Management Link */}
                <div className="bg-card-bg border border-ui-border p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:border-amber-400/40 transition-all">
                    <div>
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl flex items-center justify-center mb-3">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h3 className="font-heading text-base font-bold text-text-main mb-1">Company Management</h3>
                        <p className="text-text-muted text-xs leading-relaxed">Audit corporate partners, onboard companies, and inspect postings.</p>
                    </div>
                    <Link
                        to="/admin/companies"
                        className="mt-4 inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-600 hover:underline"
                    >
                        <span>Manage Employers</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* 3. Internships Link */}
                <div className="bg-card-bg border border-ui-border p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:border-brand-mint/40 transition-all">
                    <div>
                        <div className="w-10 h-10 bg-emerald-50 text-brand-mint border border-emerald-200 rounded-xl flex items-center justify-center mb-3">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <h3 className="font-heading text-base font-bold text-text-main mb-1">Opportunity Oversight</h3>
                        <p className="text-text-muted text-xs leading-relaxed">Moderate, audit, edit, or prune active and expired listings.</p>
                    </div>
                    <Link
                        to="/admin/internships"
                        className="mt-4 inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-mint hover:underline"
                    >
                        <span>Manage Postings</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

            </div>

        </div>
    );
}