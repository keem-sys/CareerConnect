import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentApplications } from '../services/applicationService';
import {
    FileText,
    MapPin,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentApplicationsPage() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchApplications = async () => {
        if (!user?.studentNumber) return;
        setLoading(false);
        try {
            const data = await getStudentApplications(user.studentNumber);
            setApplications(data);
        } catch (err) {
            setError('Could not fetch submitted applications. Ensure Spring Boot is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [user]);

    // Status Badge Helper
    const getStatusBadge = (status) => {
        const s = status?.toUpperCase() || 'PENDING';
        if (s === 'APPROVED' || s === 'ACCEPTED') {
            return (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approved</span>
        </span>
            );
        }
        if (s === 'REJECTED' || s === 'DECLINED') {
            return (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Declined</span>
        </span>
            );
        }
        return (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>Pending Review</span>
      </span>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Header */}
            <div className="border-b border-ui-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/20 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-semibold mb-2">
                        <FileText className="w-3.5 h-3.5" />
                        <span>WIL Application Tracker</span>
                    </div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-main">
                        My Submitted Applications
                    </h1>
                    <p className="text-text-muted text-xs">
                        Track real-time hiring decisions from employers for your CPUT internship applications.
                    </p>
                </div>

                <Link
                    to="/internships"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl shadow-md transition-all self-start sm:self-auto"
                >
                    <Briefcase className="w-4 h-4" />
                    <span>Browse More Jobs</span>
                </Link>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-xl text-xs font-semibold shadow-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-16 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-accent" />
                    <p className="text-xs text-text-muted">Loading your submitted applications...</p>
                </div>
            ) : applications.length === 0 ? (
                /* Empty State */
                <div className="bg-card-bg border border-ui-border rounded-2xl p-12 text-center space-y-4 shadow-sm">
                    <FileText className="w-12 h-12 text-text-muted mx-auto opacity-50" />
                    <div className="space-y-1">
                        <h3 className="font-heading font-bold text-text-main text-base">No Applications Submitted Yet</h3>
                        <p className="text-xs text-text-muted max-w-sm mx-auto">
                            You haven't applied to any internships yet. Explore available listings and submit your student profile!
                        </p>
                    </div>
                    <Link
                        to="/internships"
                        className="inline-block px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl shadow-md transition-all"
                    >
                        Explore Open Internships
                    </Link>
                </div>
            ) : (
                /* Applications Table / Cards */
                <div className="bg-card-bg border border-ui-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-text-main">
                            <thead className="bg-app-bg text-text-muted font-mono uppercase text-[10px] border-b border-ui-border">
                            <tr>
                                <th className="p-4">Internship Role</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Date Applied</th>
                                <th className="p-4">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-ui-border">
                            {applications.map((app) => (
                                <tr key={app.applicationId} className="hover:bg-app-bg/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-text-main text-sm">
                                            {app.internship?.title || 'Internship Position'}
                                        </div>
                                        <div className="text-[11px] font-mono text-text-muted mt-0.5">
                                            Ref: {app.applicationId}
                                        </div>
                                    </td>
                                    <td className="p-4 text-text-muted">
                                        <div className="flex items-center space-x-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                                            <span>{app.internship?.location || 'Remote / Unspecified'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-text-muted font-mono">
                                        <div className="flex items-center space-x-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-text-subtle shrink-0" />
                                            <span>
                          {app.dateApplied
                              ? new Date(app.dateApplied).toLocaleDateString()
                              : 'Recent'}
                        </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(app.status)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}