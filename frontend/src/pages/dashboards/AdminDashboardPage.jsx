import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Briefcase, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
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
                setStudentCount(students.length);
                setCompanyCount(companies.length);
                setInternshipCount(internships.length);
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
            <div className="bg-card-bg border border-ui-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card-bg border border-ui-border p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-2xl flex items-center justify-center mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-text-main mb-2">Student Directory Management</h3>
                        <p className="text-text-muted text-xs leading-relaxed">View, search, and manage registered student accounts in the database.</p>
                    </div>
                    <Link to="/admin/students" className="mt-6 inline-flex items-center space-x-2 text-xs font-semibold text-brand-accent hover:underline">
                        <span>Manage Students</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="bg-card-bg border border-ui-border p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-4">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-text-main mb-2">Company Management</h3>
                        <p className="text-text-muted text-xs leading-relaxed">Approve new employer registrations and review posted internship listings.</p>
                    </div>
                    <Link to="/companies" className="mt-6 inline-flex items-center space-x-2 text-xs font-semibold text-amber-600 hover:underline">
                        <span>Manage Employers</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}