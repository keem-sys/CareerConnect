import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Building2,
    Search,
    Trash2,
    Edit3,
    ExternalLink,
    Briefcase,
    Mail,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    X,
    Filter,
    PlusCircle,
    Save
} from 'lucide-react';
import { getAllCompanies, deleteCompany, updateCompany, createCompany } from '../services/companyService';
import { getAllInternships } from '../services/internshipService';

export default function AdminCompanyPage() {
    const [companies, setCompanies] = useState([]);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('ALL');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deletingId, setDeletingId] = useState(null);

    // Modal States
    const [viewingCompanyPostings, setViewingCompanyPostings] = useState(null);
    const [editingCompany, setEditingCompany] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state for creating a new partner
    const [newCompany, setNewCompany] = useState({
        companyId: '',
        name: '',
        industry: '',
        contactEmail: '',
        password: ''
    });

    const loadData = async () => {
        try {
            const [companiesData, internshipsData] = await Promise.all([
                getAllCompanies(),
                getAllInternships()
            ]);
            setCompanies(companiesData || []);
            setInternships(internshipsData || []);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load employer records. Ensure Spring Boot is running.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getPostingCount = (companyId) => {
        return internships.filter((job) => job.companyId === companyId).length;
    };

    const getCompanyJobs = (companyId) => {
        return internships.filter((job) => job.companyId === companyId);
    };

    // Handle Deletion
    const handleDelete = async (companyId, companyName) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to administratively revoke access for "${companyName}" (ID: ${companyId})?`
        );
        if (!confirmDelete) return;

        setDeletingId(companyId);
        setMessage({ type: '', text: '' });

        try {
            await deleteCompany(companyId);
            setMessage({
                type: 'success',
                text: `Company "${companyName}" has been successfully removed.`
            });
            setCompanies((prev) => prev.filter((c) => c.companyId !== companyId));
        } catch (err) {
            setMessage({
                type: 'error',
                text: typeof err === 'string' ? err : 'Failed to delete company.'
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
            const updated = await updateCompany(editingCompany);
            setCompanies((prev) => prev.map((c) => (c.companyId === updated.companyId ? updated : c)));
            setMessage({ type: 'success', text: `Partner details for "${updated.name}" updated successfully!` });
            setEditingCompany(null);
        } catch (err) {
            setMessage({ type: 'error', text: typeof err === 'string' ? err : 'Failed to update company.' });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Create Submit (Admin manual onboarding)
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const created = await createCompany(newCompany);
            setCompanies((prev) => [...prev, created]);
            setMessage({ type: 'success', text: `New partner organization "${created.name}" registered successfully!` });
            setShowAddModal(false);
            setNewCompany({ companyId: '', name: '', industry: '', contactEmail: '', password: '' });
        } catch (err) {
            setMessage({ type: 'error', text: typeof err === 'string' ? err : 'Failed to register company partner.' });
        } finally {
            setSubmitting(false);
        }
    };

    const industries = ['ALL', ...new Set(companies.map((c) => c.industry).filter(Boolean))];

    const filteredCompanies = companies.filter((company) => {
        const name = company.name?.toLowerCase() || '';
        const id = company.companyId?.toLowerCase() || '';
        const email = company.contactEmail?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        const matchesSearch = name.includes(search) || id.includes(search) || email.includes(search);
        const matchesIndustry = selectedIndustry === 'ALL' || company.industry === selectedIndustry;

        return matchesSearch && matchesIndustry;
    });

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Header */}
            <div className="border-b border-ui-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-600 text-xs font-mono font-semibold mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>WIL EMPLOYER GOVERNANCE</span>
                    </div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-main">
                        Industry Partner Management
                    </h1>
                    <p className="text-text-muted text-xs">
                        Audit verified companies, inspect published WIL opportunities, and manage employer partnerships.
                    </p>
                </div>

                {/* Top Action: Manually Onboard Partner */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer self-start sm:self-auto"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Onboard Partner Company</span>
                </button>
            </div>

            {/* Top Stat Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card-bg border border-ui-border p-4 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-text-muted uppercase">Verified Partners</span>
                    <h4 className="font-heading text-xl font-bold text-text-main mt-0.5">{companies.length} Companies</h4>
                </div>
                <div className="bg-card-bg border border-ui-border p-4 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-text-muted uppercase">Active Postings</span>
                    <h4 className="font-heading text-xl font-bold text-text-main mt-0.5">{internships.length} Listings</h4>
                </div>
                <div className="bg-card-bg border border-ui-border p-4 rounded-2xl shadow-xs">
                    <span className="text-[11px] font-semibold text-text-muted uppercase">Industry Sectors</span>
                    <h4 className="font-heading text-xl font-bold text-text-main mt-0.5">{industries.length - 1} Sectors</h4>
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

            {/* Search & Industry Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search company name, ID, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card-bg border border-ui-border rounded-xl pl-10 pr-4 py-2 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:border-brand-accent shadow-xs"
                    />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-text-muted shrink-0" />
                    <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="bg-card-bg border border-ui-border rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand-accent shadow-xs cursor-pointer w-full sm:w-auto"
                    >
                        {industries.map((ind) => (
                            <option key={ind} value={ind}>
                                {ind === 'ALL' ? 'All Industry Sectors' : ind}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Employer Records Table */}
            {loading ? (
                <div className="text-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-accent" />
                    <p className="text-xs text-text-muted">Loading employer records...</p>
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="bg-card-bg border border-ui-border rounded-2xl p-12 text-center space-y-3 shadow-xs">
                    <Building2 className="w-10 h-10 text-text-muted mx-auto opacity-40" />
                    <h3 className="font-heading font-bold text-text-main text-base">No Companies Found</h3>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                        No employer accounts match your current filter parameters.
                    </p>
                </div>
            ) : (
                <div className="bg-card-bg border border-ui-border rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-text-main">
                            <thead className="bg-slate-50 text-text-muted font-mono uppercase text-[10px] border-b border-ui-border">
                            <tr>
                                <th className="p-4">Partner Organization</th>
                                <th className="p-4">Industry Sector</th>
                                <th className="p-4">Primary Contact</th>
                                <th className="p-4">Active Listings</th>
                                <th className="p-4 text-right">Administrative Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-ui-border">
                            {filteredCompanies.map((company) => {
                                const jobCount = getPostingCount(company.companyId);
                                const isDeleting = deletingId === company.companyId;

                                return (
                                    <tr key={company.companyId} className="hover:bg-slate-50/50 transition-colors">

                                        {/* Company Identity */}
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-accent font-bold flex items-center justify-center text-xs shrink-0">
                                                    {company.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-text-main text-sm">
                                                        {company.name}
                                                    </div>
                                                    <div className="text-[11px] font-mono text-text-muted">
                                                        ID: {company.companyId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Industry */}
                                        <td className="p-4">
                                            <span className="font-mono text-[11px] font-semibold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-2.5 py-1 rounded-md">
                                                {company.industry || 'General IT'}
                                            </span>
                                        </td>

                                        {/* Contact */}
                                        <td className="p-4">
                                            <a
                                                href={`mailto:${company.contactEmail}`}
                                                className="inline-flex items-center space-x-1.5 text-text-muted hover:text-brand-accent transition-colors"
                                            >
                                                <Mail className="w-3.5 h-3.5 text-text-subtle" />
                                                <span>{company.contactEmail}</span>
                                            </a>
                                        </td>

                                        {/* Job Count */}
                                        <td className="p-4">
                                            <button
                                                onClick={() => setViewingCompanyPostings(company)}
                                                className="inline-flex items-center space-x-1.5 font-semibold text-brand-accent hover:underline cursor-pointer"
                                            >
                                                <Briefcase className="w-3.5 h-3.5" />
                                                <span>{jobCount} Opportunities</span>
                                            </button>
                                        </td>

                                        {/* Actions: View, Edit, Delete */}
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => setViewingCompanyPostings(company)}
                                                    title="View Published Internships"
                                                    className="p-1.5 bg-slate-50 hover:bg-brand-primary/10 text-text-muted hover:text-brand-primary border border-ui-border rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => setEditingCompany({ ...company })}
                                                    title="Edit Partner Details"
                                                    className="p-1.5 bg-slate-50 hover:bg-amber-50 text-text-muted hover:text-amber-600 border border-ui-border rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(company.companyId, company.name)}
                                                    disabled={isDeleting}
                                                    title="Revoke / Delete Partner"
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

            {/* MODAL 1: VIEW COMPANY INTERNSHIP POSTINGS */}
            {viewingCompanyPostings && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-card-bg border border-ui-border rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">

                        <div className="flex justify-between items-center border-b border-ui-border pb-3">
                            <div>
                                <h3 className="font-heading font-bold text-text-main text-base">
                                    Published Opportunities by {viewingCompanyPostings.name}
                                </h3>
                                <p className="text-text-muted text-xs">
                                    Company ID: {viewingCompanyPostings.companyId} • {viewingCompanyPostings.contactEmail}
                                </p>
                            </div>
                            <button
                                onClick={() => setViewingCompanyPostings(null)}
                                className="p-1.5 text-text-muted hover:text-text-main rounded-xl cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
                            {getCompanyJobs(viewingCompanyPostings.companyId).length === 0 ? (
                                <p className="text-xs text-text-muted italic py-6 text-center">
                                    This company has not published any internship listings yet.
                                </p>
                            ) : (
                                getCompanyJobs(viewingCompanyPostings.companyId).map((job) => (
                                    <div
                                        key={job.internshipId}
                                        className="p-4 bg-app-bg border border-ui-border rounded-2xl flex items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-xs text-text-main">{job.title}</h4>
                                            <p className="text-[11px] text-text-muted line-clamp-1">{job.description}</p>
                                            <div className="text-[10px] font-mono text-text-subtle">
                                                Location: {job.location} • Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling'}
                                            </div>
                                        </div>

                                        <Link
                                            to={`/internships/${job.internshipId}`}
                                            className="px-3 py-1.5 bg-card-bg hover:bg-slate-100 border border-ui-border rounded-xl text-[11px] font-semibold text-brand-accent shrink-0 inline-flex items-center space-x-1"
                                        >
                                            <span>Inspect</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-3 border-t border-ui-border flex justify-end">
                            <button
                                onClick={() => setViewingCompanyPostings(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-text-main font-semibold rounded-xl text-xs cursor-pointer"
                            >
                                Close Window
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* MODAL 2: EDIT COMPANY DETAILS */}
            {editingCompany && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleEditSubmit} className="bg-card-bg border border-ui-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-ui-border pb-3">
                            <h3 className="font-heading font-bold text-text-main text-base">Edit Partner Organization</h3>
                            <button type="button" onClick={() => setEditingCompany(null)} className="p-1 text-text-muted hover:text-text-main">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={editingCompany.name}
                                    onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Industry Sector</label>
                                <input
                                    type="text"
                                    value={editingCompany.industry}
                                    onChange={(e) => setEditingCompany({ ...editingCompany, industry: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Corporate Contact Email</label>
                                <input
                                    type="email"
                                    value={editingCompany.contactEmail}
                                    onChange={(e) => setEditingCompany({ ...editingCompany, contactEmail: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-ui-border flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setEditingCompany(null)}
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
                                <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL 3: ADD NEW PARTNER (MANUAL ONBOARDING) */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleCreateSubmit} className="bg-card-bg border border-ui-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-ui-border pb-3">
                            <div>
                                <h3 className="font-heading font-bold text-text-main text-base">Onboard Industry Partner</h3>
                                <p className="text-text-muted text-[11px]">Register a verified corporate hiring partner to CareerConnect.</p>
                            </div>
                            <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-text-muted hover:text-text-main">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Company Registration ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. C003"
                                    value={newCompany.companyId}
                                    onChange={(e) => setNewCompany({ ...newCompany, companyId: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 font-mono text-text-main"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Company Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Standard Bank Technology"
                                    value={newCompany.name}
                                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Industry Sector</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Financial Services & FinTech"
                                    value={newCompany.industry}
                                    onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Recruiter Contact Email</label>
                                <input
                                    type="email"
                                    placeholder="e.g. careers@standardbank.co.za"
                                    value={newCompany.contactEmail}
                                    onChange={(e) => setNewCompany({ ...newCompany, contactEmail: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Temporary Initial Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newCompany.password}
                                    onChange={(e) => setNewCompany({ ...newCompany, password: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 font-mono text-text-main"
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
                                <span>{submitting ? 'Registering...' : 'Register Partner'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
}