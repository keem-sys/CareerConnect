import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllInternships, updateInternship, deleteInternship } from '../services/internshipService';
import {
    Briefcase,
    PlusCircle,
    Users,
    Pencil,
    Trash2,
    Calendar,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    Search
} from 'lucide-react';

export default function MyCompanyPostingsPage() {
    const { user } = useAuth();
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Modal State
    const [editingPost, setEditingPost] = useState(null);
    const [editFormData, setEditFormData] = useState({
        internshipId: '',
        title: '',
        description: '',
        location: '',
        deadline: ''
    });
    const [saving, setSaving] = useState(false);

    // Fetch postings on load
    const fetchMyPostings = async () => {
        try {
            const allInternships = await getAllInternships();
            // In a full production setup with company ownership, we filter by companyId.
            // For now, it shows the active listings available to manage:
            setPostings(allInternships || []);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load your company listings from the server.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPostings();
    }, []);

    // Open Edit Modal
    const handleEditClick = (post) => {
        setEditingPost(post);
        // Format deadline for datetime-local input if present
        const formattedDeadline = post.deadline
            ? new Date(post.deadline).toISOString().slice(0, 16)
            : '';

        setEditFormData({
            internshipId: post.internshipId,
            title: post.title || '',
            description: post.description || '',
            location: post.location || '',
            deadline: formattedDeadline
        });
    };

    // Submit Edit Form
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await updateInternship({
                internshipId: editFormData.internshipId,
                title: editFormData.title.trim(),
                description: editFormData.description.trim(),
                location: editFormData.location.trim(),
                deadline: editFormData.deadline
            });

            setMessage({ type: 'success', text: `Posting "${editFormData.title}" updated successfully!` });
            setEditingPost(null);
            fetchMyPostings(); // Refresh table
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update posting. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    // Delete / Close Posting
    const handleDelete = async (internshipId, title) => {
        if (window.confirm(`Are you sure you want to close and remove the posting for "${title}"?`)) {
            try {
                await deleteInternship(internshipId);
                setMessage({ type: 'success', text: `Posting "${title}" removed successfully.` });
                fetchMyPostings();
            } catch (err) {
                setMessage({ type: 'error', text: 'Failed to delete listing. Note: Only Admins or Owners may remove posts.' });
            }
        }
    };

    // Filter listings by search query
    const filteredPostings = postings.filter((p) => {
        const title = p.title?.toLowerCase() || '';
        const loc = p.location?.toLowerCase() || '';
        return title.includes(searchTerm.toLowerCase()) || loc.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Page Header */}
            <div className="border-b border-ui-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/20 px-3 py-1 rounded-full text-brand-primary text-xs font-mono font-semibold mb-2">
                        <Briefcase className="w-3.5 h-3.5 text-brand-accent" />
                        <span>Employer Management Portal</span>
                    </div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-main">
                        Manage Company Postings
                    </h1>
                    <p className="text-text-muted text-xs">
                        Review your active WIL internship listings, monitor deadlines, and access candidate applicants.
                    </p>
                </div>

                <Link
                    to="/internships/new"
                    className="inline-flex items-center space-x-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer self-start sm:self-auto"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post New Internship</span>
                </Link>
            </div>

            {/* Alert Banner */}
            {message.text && (
                <div className={`flex items-center space-x-2 p-4 rounded-xl font-medium text-xs border shadow-sm ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Search & Stats Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Filter postings by title or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card-bg border border-ui-border rounded-xl pl-10 pr-4 py-2 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:border-brand-accent shadow-sm"
                    />
                </div>

                <div className="text-xs text-text-muted font-mono self-end sm:self-center">
                    Total Postings: <strong className="text-text-main">{filteredPostings.length}</strong>
                </div>
            </div>

            {/* Main Postings Table */}
            {loading ? (
                <div className="text-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-accent" />
                    <p className="text-xs text-text-muted">Loading your company listings...</p>
                </div>
            ) : filteredPostings.length === 0 ? (
                <div className="bg-card-bg border border-ui-border rounded-2xl p-12 text-center space-y-3 shadow-sm">
                    <Briefcase className="w-10 h-10 text-text-muted mx-auto opacity-40" />
                    <h3 className="font-heading font-bold text-text-main text-base">No Postings Found</h3>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                        You haven't published any internship opportunities yet. Create your first listing to start receiving student applications.
                    </p>
                    <Link
                        to="/internships/new"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl mt-2"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Create Listing Now</span>
                    </Link>
                </div>
            ) : (
                <div className="bg-card-bg border border-ui-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-text-main">
                            <thead className="bg-slate-50 text-text-muted font-mono uppercase text-[10px] border-b border-ui-border">
                            <tr>
                                <th className="p-4">Internship Role</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Application Deadline</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-ui-border">
                            {filteredPostings.map((post) => {
                                const isExpired = post.deadline && new Date(post.deadline) < new Date();

                                return (
                                    <tr key={post.internshipId} className="hover:bg-slate-50/50 transition-colors">
                                        {/* Title & Ref */}
                                        <td className="p-4">
                                            <div className="font-bold text-text-main text-sm">
                                                {post.title}
                                            </div>
                                            <div className="text-[11px] font-mono text-text-muted mt-0.5">
                                                Ref: {post.internshipId}
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="p-4 text-text-muted">
                                            <div className="flex items-center space-x-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                                                <span>{post.location}</span>
                                            </div>
                                        </td>

                                        {/* Deadline */}
                                        <td className="p-4 font-mono text-text-muted">
                                            <div className="flex items-center space-x-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-text-subtle shrink-0" />
                                                <span>
                            {post.deadline
                                ? new Date(post.deadline).toLocaleDateString()
                                : 'Not specified'}
                          </span>
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="p-4">
                                            {isExpired ? (
                                                <span className="font-mono text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            EXPIRED
                          </span>
                                            ) : (
                                                <span className="font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            ACTIVE
                          </span>
                                            )}
                                        </td>

                                        {/* Action Buttons */}
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    to={`/company/applicants?internshipId=${post.internshipId}`}
                                                    title="View Student Applicants for this Job"
                                                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-brand-primary bg-slate-100 hover:bg-slate-200 border border-ui-border rounded-lg text-xs font-semibold transition-colors"
                                                >
                                                    <Users className="w-3.5 h-3.5" />
                                                    <span className="hidden sm:inline">Applicants</span>
                                                </Link>

                                                {/* Edit Listing */}
                                                <button
                                                    onClick={() => handleEditClick(post)}
                                                    title="Edit Listing"
                                                    className="p-1.5 text-text-muted hover:text-brand-accent hover:bg-slate-100 border border-ui-border rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>

                                                {/* Delete / Remove Listing */}
                                                <button
                                                    onClick={() => handleDelete(post.internshipId, post.title)}
                                                    title="Delete / Close Listing"
                                                    className="p-1.5 text-text-muted hover:text-rose-600 hover:bg-rose-50 border border-ui-border hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
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

            {/* EDIT POSTING MODAL */}
            {editingPost && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-card-bg border border-ui-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">

                        <div className="flex justify-between items-center border-b border-ui-border pb-3">
                            <div className="flex items-center space-x-2">
                                <Pencil className="w-4 h-4 text-brand-accent" />
                                <h3 className="font-heading font-bold text-text-main text-base">Edit Internship Posting</h3>
                            </div>
                            <button
                                onClick={() => setEditingPost(null)}
                                className="p-1 text-text-muted hover:text-text-main rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-muted mb-1">Internship Reference ID (Read Only)</label>
                                <input
                                    type="text"
                                    value={editFormData.internshipId}
                                    disabled
                                    className="w-full bg-slate-50 border border-ui-border rounded-xl px-3 py-2 text-xs font-mono text-brand-accent cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-muted mb-1">Internship Title</label>
                                <input
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-muted mb-1">Location</label>
                                <input
                                    type="text"
                                    value={editFormData.location}
                                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-muted mb-1">Application Deadline</label>
                                <input
                                    type="datetime-local"
                                    value={editFormData.deadline}
                                    onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-muted mb-1">Job Description</label>
                                <textarea
                                    rows="4"
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl p-3 text-xs text-text-main focus:outline-none"
                                />
                            </div>

                            <div className="pt-2 flex justify-end space-x-2 border-t border-ui-border">
                                <button
                                    type="button"
                                    onClick={() => setEditingPost(null)}
                                    className="px-4 py-2 rounded-xl text-xs text-text-muted hover:text-text-main bg-slate-50 border border-ui-border font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover shadow-md cursor-pointer transition-all disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}