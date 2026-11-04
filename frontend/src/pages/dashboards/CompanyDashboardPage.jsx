import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Users, TrendingUp, PlusCircle, Loader2 } from 'lucide-react';
import { useAuth } from "../../context/AuthContext.jsx";
import { getInternshipsByCompany } from '../../services/internshipService';
import { getCompanyApplications } from '../../services/applicationService';

export default function CompanyDashboardPage() {
    const { user } = useAuth();
    const [myPostingsCount, setMyPostingsCount] = useState(0);
    const [applicantCount, setApplicantCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyStats = async () => {
            const companyId = user?.companyId;

            if (!companyId) {
                console.warn("Company Dashboard: No company ID found on user object:", user);
                setLoading(false);
                return;
            }

            try {
                const postings = await getInternshipsByCompany(companyId);
                setMyPostingsCount(Array.isArray(postings) ? postings.length : 0);

                const applicants = await getCompanyApplications(companyId);
                setApplicantCount(Array.isArray(applicants) ? applicants.length : 0);
            } catch (err) {
                console.error("Failed to load company metrics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyStats();
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="bg-card-bg border border-ui-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/30 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-semibold">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>EMPLOYER PORTAL</span>
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-main">
                        Welcome, {user?.name}! 🏢
                    </h1>
                    <p className="text-text-muted text-xs sm:text-sm max-w-2xl">
                        Manage your internship opportunities, review incoming student applications, and recruit top emerging talent.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-xl">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Active Postings</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin inline text-brand-accent" /> : `${myPostingsCount} Listings`}
                        </h3>
                    </div>
                </div>

                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-emerald-50 text-brand-mint border border-emerald-200 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Total Applicants</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin inline text-brand-mint" /> : `${applicantCount} Candidates`}
                        </h3>
                    </div>
                </div>

                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Account Status</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">Verified Partner</h3>
                    </div>
                </div>
            </div>

            <div className="bg-card-bg border border-ui-border p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-heading text-xl font-bold text-text-main mb-1">Post a New Internship Position</h3>
                    <p className="text-text-muted text-xs max-w-xl">Create a new internship listing to start receiving applications from qualified software development students.</p>
                </div>
                <Link to="/internships/new" className="px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl text-xs shadow-lg shadow-brand-primary/20 shrink-0 flex items-center space-x-2">
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Internship</span>
                </Link>
            </div>
        </div>
    );
}