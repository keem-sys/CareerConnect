import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, UserCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from "../../context/AuthContext.jsx";
import { getAllInternships } from '../../services/internshipService';
import { getStudentApplications } from '../../services/applicationService';

export default function StudentDashboardPage() {
    const { user } = useAuth();
    const [internshipCount, setInternshipCount] = useState(0);
    const [applicationCount, setApplicationCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRealStats = async () => {
            try {
                const internships = await getAllInternships();
                setInternshipCount(internships.length);

                if (user?.studentNumber) {
                    const applications = await getStudentApplications(user.studentNumber);
                    setApplicationCount(applications.length);
                }
            } catch (err) {
                console.error("Failed to load student dashboard metrics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRealStats();
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="bg-card-bg border border-ui-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-brand-mint text-xs font-mono font-semibold">
                        <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
                        <span>STUDENT PORTAL</span>
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-main">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-text-muted text-xs sm:text-sm max-w-2xl">
                        Explore active internship postings, track your application statuses, and keep your student profile up to date.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-xl">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Available Postings</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin inline text-brand-accent" /> : `${internshipCount} Positions`}
                        </h3>
                    </div>
                </div>

                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-emerald-50 text-brand-mint border border-emerald-200 rounded-xl">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Submitted Applications</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin inline text-brand-mint" /> : `${applicationCount} Active`}
                        </h3>
                    </div>
                </div>

                <div className="bg-card-bg border border-ui-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
                    <div className="p-3.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">Profile Status</p>
                        <h3 className="font-heading text-2xl font-bold text-text-main mt-0.5">Verified</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card-bg border border-ui-border p-8 rounded-3xl shadow-lg flex flex-col justify-between hover:border-brand-accent/50 transition-all group">
                    <div>
                        <div className="w-12 h-12 bg-brand-primary/10 text-brand-accent border border-brand-accent/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-text-main mb-2">Explore Internships</h3>
                        <p className="text-text-muted text-xs leading-relaxed">Browse positions from verified tech employers, check requirements, and submit your application.</p>
                    </div>
                    <Link to="/internships" className="mt-6 inline-flex items-center space-x-2 text-xs font-semibold text-brand-accent hover:underline">
                        <span>View All Internships</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-card-bg border border-ui-border p-8 rounded-3xl shadow-lg flex flex-col justify-between hover:border-brand-accent/50 transition-all group">
                    <div>
                        <div className="w-12 h-12 bg-emerald-50 text-brand-mint border border-emerald-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-text-main mb-2">Track Applications</h3>
                        <p className="text-text-muted text-xs leading-relaxed">Check real-time application status updates ("Pending Review", "Interview Scheduled", "Approved").</p>
                    </div>
                    <Link to="/applications" className="mt-6 inline-flex items-center space-x-2 text-xs font-semibold text-brand-mint hover:underline">
                        <span>View My Statuses</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}