import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    Search,
    Trash2,
    Edit3,
    ExternalLink,
    Calendar,
    MapPin,
    Building2,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    Filter,
    PlusCircle,
    Users,
    Save,
    X
} from 'lucide-react';
import {
    getAllInternships,
    deleteInternship,
    updateInternship,
    createInternship
} from '../services/internshipService';
import { getAllCompanies } from '../services/companyService';
import { getAllApplications } from '../services/applicationService';

export default function AdminInternshipPage() {
    const [internships, setInternships] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'EXPIRED'
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deletingId, setDeletingId] = useState(null);

    // Modal States
    const [editingJob, setEditingJob] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state for creating a new opportunity
    const [newJob, setNewJob] = useState({
        internshipId: '',
        companyId: '',
        title: '',
        description: '',
        location: '',
        deadline: ''
    });

    const loadData = async () => {
        try {
            const [jobsData, compsData, appsData] = await Promise.all([
                getAllInternships(),
                getAllCompanies(),
                getAllApplications().catch(() => [])
            ]);
            setInternships(jobsData || []);
            setCompanies(compsData || []);
            setApplications(appsData || []);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load opportunity records. Ensure Spring Boot is running.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Helper: Company Name
    const getCompanyName = (companyId) => {
        const found = companies.find((c) => c.companyId === companyId);
        return found ? found.name : 'Unknown / Partner';
    };

    // Helper: Count applications per internship
    const getApplicationCount = (internshipId) => {
        return applications.filter(
            (app) => (app.internship?.internshipId || app.internship?.id) === internshipId
        ).length;
    };

    // Administrative Deletion
    const handleDelete = async (internshipId, title) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to administratively remove "${title}" (ID: ${internshipId})? This will delete the listing and any associated applications.`
        );
        if (!confirmDelete) return;

        setDeletingId(internshipId);
        setMessage({ type: '', text: '' });

        try {
            await deleteInternship(internshipId);
            setMessage({
                type: 'success',
                text: `Listing "${title}" was successfully deleted from the platform.`
            });
            setInternships((prev) => prev.filter((job) => job.internshipId !== internshipId));
        } catch (err) {
            setMessage({
                type: 'error',
                text: typeof err === 'string' ? err : 'Failed to delete internship. Ensure server is running.'
            });
        } finally {
            setDeletingId(null);
        }
    };

    // Handle Edit Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            // Ensure deadline has ISO format with time if only date is selected
            const formattedPayload = {
                ...editingJob,
                deadline: editingJob.deadline?.includes('T')
                    ? editingJob.deadline
                    : `${editingJob.deadline}T23:59:59`
            };

            const updated = await updateInternship(formattedPayload);
            setInternships((prev) => prev.map((j) => (j.internshipId === updated.internshipId ? updated : j)));
            setMessage({ type: 'success', text: `Opportunity "${updated.title}" updated successfully!` });
            setEditingJob(null);
        } catch (err) {
            setMessage({ type: 'error', text: typeof err === 'string' ? err : 'Failed to update internship.' });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Create Submit
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const formattedPayload = {
                ...newJob,
                deadline: newJob.deadline?.includes('T')
                    ? newJob.deadline
                    : `${newJob.deadline}T23:59:59`
            };

            const created = await createInternship(formattedPayload);
            setInternships((prev) => [...prev, created]);
            setMessage({ type: 'success', text: `New WIL Opportunity "${created.title}" published successfully!` });
            setShowAddModal(false);
            setNewJob({ internshipId: '', companyId: '', title: '', description: '', location: '', deadline: '' });
        } catch (err) {
            setMessage({ type: 'error', text: typeof err === 'string' ? err : 'Failed to create internship listing.' });
        } finally {
            setSubmitting(false);
        }
    };

    // Derived Statistics
    const activeCount = internships.filter((job) => !job.deadline || new Date(job.deadline) >= new Date()).length;
    const expiredCount = internships.length - activeCount;

    // Filter Logic
    const filteredInternships = internships.filter((job) => {
        const title = job.title?.toLowerCase() || '';
        const id = job.internshipId?.toLowerCase() || '';
        const location = job.location?.toLowerCase() || '';
        const compName = getCompanyName(job.companyId).toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesSearch = title.includes(search) || id.includes(search) || location.includes(search) || compName.includes(search);

        const isExpired = job.deadline && new Date(job.deadline) < new Date();
        const matchesStatus =
            statusFilter === 'ALL' ||
            (statusFilter === 'ACTIVE' && !isExpired) ||
            (statusFilter === 'EXPIRED' && isExpired);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Header */}
            <div className="border-b border-ui-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-600 text-xs font-mono font-semibold mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>OPPORTUNITY QUALITY OVERSIGHT</span>
                    </div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-main">
                        Global Internship Management
                    </h1>
                    <p className="text-text-muted text-xs">
                        Audit, monitor, and moderate all Work-Integrated Learning (WIL) postings published across the university network.
                    </p>
                </div>

                {/* Top Action: Post Opportunity */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer self-start sm:self-auto"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create WIL Opportunity</span>
                </button>
            </div>

            {/* Top Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-card-bg border border-ui-border p-4 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-text-muted uppercase">Total Postings</span>
                    <h4 className="font-heading text-xl font-bold text-text-main mt-0.5">{internships.length} Listings</h4>
                </div>
                <div className="bg-card-bg border border-ui-border p-4 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-text-muted uppercase">Active Opportunities</span>
                    <h4 className="font-heading text-xl font-bold text-brand-mint mt-0.5">{activeCount} Open</h4>
                </div>
                <div className="bg-card-bg border border-ui-border p-4 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-text-muted uppercase">Past Deadline</span>
                    <h4 className="font-heading text-xl font-bold text-rose-600 mt-0.5">{expiredCount} Closed</h4>
                </div>
                <div className="bg-card-bg border border-ui-border p-4 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-text-muted uppercase">Student Applications</span>
                    <h4 className="font-heading text-xl font-bold text-brand-accent mt-0.5">{applications.length} Submitted</h4>
                </div>
            </div>

            {/* Notification Banner */}
            {message.text && (
                <div className={`flex items-center space-x-2 p-4 rounded-xl font-medium text-xs border shadow-xs ${
                    message.type === 'success'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Search & Status Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search by title, company, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card-bg border border-ui-border rounded-xl pl-10 pr-4 py-2 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:border-brand-accent shadow-xs"
                    />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-text-muted shrink-0" />
                    <div className="flex gap-1.5 bg-card-bg p-1 rounded-xl border border-ui-border">
                        {['ALL', 'ACTIVE', 'EXPIRED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    statusFilter === status
                                        ? 'bg-brand-primary text-white shadow-xs'
                                        : 'text-text-muted hover:text-text-main'
                                }`}
                            >
                                {status === 'ALL' ? 'All Postings' : status === 'ACTIVE' ? 'Active Listings' : 'Expired / Closed'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Internships Management Table */}
            {loading ? (
                <div className="text-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-accent" />
                    <p className="text-xs text-text-muted">Loading platform listings...</p>
                </div>
            ) : filteredInternships.length === 0 ? (
                <div className="bg-card-bg border border-ui-border rounded-2xl p-12 text-center space-y-3 shadow-xs">
                    <Briefcase className="w-10 h-10 text-text-muted mx-auto opacity-40" />
                    <h3 className="font-heading font-bold text-text-main text-base">No Listings Found</h3>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                        No internship opportunities match your search or filter criteria.
                    </p>
                </div>
            ) : (
                <div className="bg-card-bg border border-ui-border rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-text-main">
                            <thead className="bg-slate-50 text-text-muted font-mono uppercase text-[10px] border-b border-ui-border">
                            <tr>
                                <th className="p-4">Internship Role & ID</th>
                                <th className="p-4">Employer Partner</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Candidates</th>
                                <th className="p-4">Deadline & Status</th>
                                <th className="p-4 text-right">Administrative Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-ui-border">
                            {filteredInternships.map((job) => {
                                const isExpired = job.deadline && new Date(job.deadline) < new Date();
                                const isDeleting = deletingId === job.internshipId;
                                const employer = getCompanyName(job.companyId);
                                const appCount = getApplicationCount(job.internshipId);

                                return (
                                    <tr key={job.internshipId} className="hover:bg-slate-50/50 transition-colors">

                                        {/* Title & Ref */}
                                        <td className="p-4">
                                            <div className="font-bold text-text-main text-sm">
                                                {job.title}
                                            </div>
                                            <div className="text-[11px] font-mono text-text-muted mt-0.5">
                                                Ref: {job.internshipId}
                                            </div>
                                        </td>

                                        {/* Company */}
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <Building2 className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                                                <span className="font-semibold text-text-main">{employer}</span>
                                            </div>
                                            <div className="text-[10px] font-mono text-text-muted">
                                                CID: {job.companyId}
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="p-4 text-text-muted">
                                            <div className="flex items-center space-x-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-text-subtle shrink-0" />
                                                <span>{job.location}</span>
                                            </div>
                                        </td>

                                        {/* Candidate Applications */}
                                        <td className="p-4">
                                            <span className="inline-flex items-center space-x-1.5 font-semibold text-brand-primary bg-slate-100 border border-ui-border px-2.5 py-1 rounded-lg text-[11px]">
                                                <Users className="w-3 h-3 text-brand-accent" />
                                                <span>{appCount} Applied</span>
                                            </span>
                                        </td>

                                        {/* Deadline & Status */}
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="font-mono text-text-muted flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3 text-text-subtle" />
                                                    <span>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling'}</span>
                                                </div>
                                                {isExpired ? (
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                        EXPIRED
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-brand-mint border border-emerald-200">
                                                        ACTIVE
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions: View, Edit, Delete */}
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    to={`/internships/${job.internshipId}`}
                                                    title="Inspect Public View"
                                                    className="p-1.5 bg-slate-50 hover:bg-brand-primary/10 text-text-muted hover:text-brand-primary border border-ui-border rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>

                                                <button
                                                    onClick={() => setEditingJob({
                                                        ...job,
                                                        deadline: job.deadline ? job.deadline.substring(0, 10) : ''
                                                    })}
                                                    title="Edit Opportunity Details"
                                                    className="p-1.5 bg-slate-50 hover:bg-amber-50 text-text-muted hover:text-amber-600 border border-ui-border rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(job.internshipId, job.title)}
                                                    disabled={isDeleting}
                                                    title="Administratively Remove Posting"
                                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
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

            {/* MODAL 1: EDIT INTERNSHIP */}
            {editingJob && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleEditSubmit} className="bg-card-bg border border-ui-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-ui-border pb-3">
                            <h3 className="font-heading font-bold text-text-main text-base">Edit Opportunity Details</h3>
                            <button type="button" onClick={() => setEditingJob(null)} className="p-1 text-text-muted hover:text-text-main">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Position Title</label>
                                <input
                                    type="text"
                                    value={editingJob.title}
                                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Work Location</label>
                                <input
                                    type="text"
                                    value={editingJob.location}
                                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Application Deadline</label>
                                <input
                                    type="date"
                                    value={editingJob.deadline || ''}
                                    onChange={(e) => setEditingJob({ ...editingJob, deadline: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main font-mono"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Role Description & Requirements</label>
                                <textarea
                                    rows="4"
                                    value={editingJob.description}
                                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-ui-border flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setEditingJob(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-text-main font-semibold rounded-xl text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-primary text-white font-semibold rounded-xl text-xs hover:bg-brand-primary-hover shadow-sm"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>{submitting ? 'Saving...' : 'Save Updates'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL 2: CREATE NEW INTERNSHIP (ADMIN POSTING) */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleCreateSubmit} className="bg-card-bg border border-ui-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-ui-border pb-3">
                            <div>
                                <h3 className="font-heading font-bold text-text-main text-base">Create WIL Opportunity</h3>
                                <p className="text-text-muted text-[11px]">Publish an internship opportunity on behalf of a partner organization.</p>
                            </div>
                            <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-text-muted hover:text-text-main">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block font-semibold text-text-muted mb-1">Internship Reference ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. INT-004"
                                        value={newJob.internshipId}
                                        onChange={(e) => setNewJob({ ...newJob, internshipId: e.target.value })}
                                        required
                                        className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 font-mono text-text-main"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-text-muted mb-1">Partner Organization</label>
                                    <select
                                        value={newJob.companyId}
                                        onChange={(e) => setNewJob({ ...newJob, companyId: e.target.value })}
                                        required
                                        className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main cursor-pointer"
                                    >
                                        <option value="">Select Employer...</option>
                                        {companies.map((c) => (
                                            <option key={c.companyId} value={c.companyId}>
                                                {c.name} ({c.companyId})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Position Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Junior Java / Spring Boot Developer"
                                    value={newJob.title}
                                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block font-semibold text-text-muted mb-1">Location</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Cape Town / Remote"
                                        value={newJob.location}
                                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                        required
                                        className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-text-muted mb-1">Application Deadline</label>
                                    <input
                                        type="date"
                                        value={newJob.deadline}
                                        onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                                        required
                                        className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Role Description & Requirements</label>
                                <textarea
                                    rows="3"
                                    placeholder="Describe responsibilities, stack requirements, and WIL expectations..."
                                    value={newJob.description}
                                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-ui-border flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-text-main font-semibold rounded-xl text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-primary text-white font-semibold rounded-xl text-xs hover:bg-brand-primary-hover shadow-sm"
                            >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>{submitting ? 'Publishing...' : 'Publish Listing'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
}