import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {getAllApplications, getCompanyApplications, updateApplicationStatus} from '../services/applicationService';
import { getProfileByStudentNumber } from '../services/profileService';
import {
    Users,
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    ExternalLink,
    AlertCircle,
    Loader2,
    X,
    FileText
} from 'lucide-react';

export default function CompanyApplicantsPage() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Candidate Profile Modal State
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    // Fetch all applications
    const fetchApplications = async () => {
        try {
            const data = await getCompanyApplications(user.companyId || user.email);
            setApplications(data || []);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load student applicants from server.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusChange = async (applicationId, newStatus) => {
        setUpdatingId(applicationId);
        setMessage({ type: '', text: '' });

        try {
            await updateApplicationStatus(applicationId, newStatus);
            setMessage({
                type: 'success',
                text: `Application status updated to "${newStatus}" successfully!`
            });
            // Refresh list
            fetchApplications();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update application status.' });
        } finally {
            setUpdatingId(null);
        }
    };

    // Inspect Student Profile & Resume
    const handleViewProfile = async (studentNumber, studentName) => {
        setLoadingProfile(true);
        setSelectedProfile(null);

        try {
            const profile = await getProfileByStudentNumber(studentNumber);
            setSelectedProfile(profile || { bio: 'No bio provided.', skills: [], resumeLink: '' });
        } catch (err) {
            setSelectedProfile({ bio: 'No formal profile created yet.', skills: [], resumeLink: '' });
        } finally {
            setLoadingProfile(false);
        }
    };

    // Filter Applicants
    const filteredApplications = applications.filter((app) => {
        const studentName = app.student?.name?.toLowerCase() || '';
        const studentNum = app.student?.studentNumber?.toLowerCase() || '';
        const jobTitle = app.internship?.title?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        const matchesSearch = studentName.includes(search) || studentNum.includes(search) || jobTitle.includes(search);
        const matchesStatus = statusFilter === 'ALL' || app.status?.toUpperCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Status Badge UI Helper
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
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Pending Review</span>
      </span>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Page Header */}
            <div className="border-b border-ui-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/20 px-3 py-1 rounded-full text-brand-primary text-xs font-mono font-semibold mb-2">
                        <Users className="w-3.5 h-3.5 text-brand-accent" />
                        <span>Candidate Evaluation</span>
                    </div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-main">
                        Student Applicants
                    </h1>
                    <p className="text-text-muted text-xs">
                        Review incoming student applications, inspect resumes, and manage recruitment decisions.
                    </p>
                </div>
            </div>

            {/* Alert Messages */}
            {message.text && (
                <div className={`flex items-center space-x-2 p-4 rounded-xl font-medium text-xs border shadow-sm ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search by student or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card-bg border border-ui-border rounded-xl pl-10 pr-4 py-2 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:border-brand-accent shadow-sm"
                    />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                statusFilter === status
                                    ? 'bg-brand-primary text-white shadow-sm'
                                    : 'bg-card-bg text-text-muted hover:text-text-main border border-ui-border'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Table */}
            {loading ? (
                <div className="text-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-accent" />
                    <p className="text-xs text-text-muted">Loading candidate applications...</p>
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="bg-card-bg border border-ui-border rounded-2xl p-12 text-center space-y-3 shadow-sm">
                    <FileText className="w-10 h-10 text-text-muted mx-auto opacity-40" />
                    <h3 className="font-heading font-bold text-text-main text-base">No Applicants Found</h3>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                        No student applications match your filter criteria.
                    </p>
                </div>
            ) : (
                <div className="bg-card-bg border border-ui-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-text-main">
                            <thead className="bg-slate-50 text-text-muted font-mono uppercase text-[10px] border-b border-ui-border">
                            <tr>
                                <th className="p-4">Candidate Student</th>
                                <th className="p-4">Applied Position</th>
                                <th className="p-4">Date Applied</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Recruitment Decision</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-ui-border">
                            {filteredApplications.map((app) => {
                                const isUpdating = updatingId === app.applicationId;

                                return (
                                    <tr key={app.applicationId} className="hover:bg-slate-50/50 transition-colors">

                                        {/* Candidate Name & ID */}
                                        <td className="p-4">
                                            <div className="font-bold text-text-main text-sm">
                                                {app.student?.name || 'CPUT Student'}
                                            </div>
                                            <div className="text-[11px] font-mono text-text-muted mt-0.5">
                                                ID: {app.student?.studentNumber} • {app.student?.email}
                                            </div>
                                            <button
                                                onClick={() => handleViewProfile(app.student?.studentNumber, app.student?.name)}
                                                className="mt-1 inline-flex items-center space-x-1 text-[11px] text-brand-accent hover:underline font-semibold cursor-pointer"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                <span>View Profile & CV</span>
                                            </button>
                                        </td>

                                        {/* Position Title */}
                                        <td className="p-4">
                                            <div className="font-semibold text-text-main">
                                                {app.internship?.title || 'Internship Listing'}
                                            </div>
                                            <div className="text-text-muted text-[11px]">
                                                {app.internship?.location}
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="p-4 font-mono text-text-muted">
                                            {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : 'Recent'}
                                        </td>

                                        {/* Status */}
                                        <td className="p-4">
                                            {getStatusBadge(app.status)}
                                        </td>

                                        {/* Decision Buttons */}
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleStatusChange(app.applicationId, 'Approved')}
                                                    disabled={isUpdating || app.status?.toUpperCase() === 'APPROVED'}
                                                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-40 cursor-pointer"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    <span>Approve</span>
                                                </button>

                                                <button
                                                    onClick={() => handleStatusChange(app.applicationId, 'Rejected')}
                                                    disabled={isUpdating || app.status?.toUpperCase() === 'REJECTED'}
                                                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-40 cursor-pointer"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    <span>Decline</span>
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* STUDENT PROFILE & RESUME MODAL */}
            {selectedProfile && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-card-bg border border-ui-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">

                        <div className="flex justify-between items-center border-b border-ui-border pb-3">
                            <h3 className="font-heading font-bold text-text-main text-base">Candidate Profile Evaluation</h3>
                            <button
                                onClick={() => setSelectedProfile(null)}
                                className="p-1 text-text-muted hover:text-text-main rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="font-bold text-text-muted uppercase text-[10px] tracking-wider block mb-1">
                                    Candidate Bio
                                </label>
                                <p className="bg-slate-50 border border-ui-border rounded-xl p-3 text-text-main">
                                    {selectedProfile.bio}
                                </p>
                            </div>

                            <div>
                                <label className="font-bold text-text-muted uppercase text-[10px] tracking-wider block mb-1">
                                    Skills & Tech Stack
                                </label>
                                {selectedProfile.skills?.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedProfile.skills.map((skill) => (
                                            <span key={skill} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md font-mono text-[11px]">
                        {skill}
                      </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-muted italic">No skills listed.</p>
                                )}
                            </div>

                            <div>
                                <label className="font-bold text-text-muted uppercase text-[10px] tracking-wider block mb-1">
                                    Verified Resume / CV
                                </label>
                                {selectedProfile.resumeLink ? (
                                    <a
                                        href={selectedProfile.resumeLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center space-x-1.5 text-brand-accent hover:underline font-semibold bg-brand-primary/5 border border-brand-accent/20 px-3 py-2 rounded-xl"
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>Open Student Resume PDF</span>
                                    </a>
                                ) : (
                                    <p className="text-text-muted italic">No resume link uploaded.</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-ui-border flex justify-end">
                            <button
                                onClick={() => setSelectedProfile(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-text-main font-semibold rounded-xl text-xs cursor-pointer"
                            >
                                Close Preview
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}