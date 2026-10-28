import React, { useState, useEffect } from 'react';
import { readCompany, updateCompany } from '../services/companyService';
import { useAuth } from '../context/AuthContext';
import {
    Building2,
    Mail,
    Briefcase,
    Hash,
    KeyRound,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Save
} from 'lucide-react';

export default function CompanyProfilePage() {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Corporate Profile State
    const [profileData, setProfileData] = useState({
        companyId: '',
        name: '',
        industry: '',
        contactEmail: '',
        password: ''
    });

    // Security Form State
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Fetch fresh company details from MySQL on mount
    useEffect(() => {
        const fetchCompanyDetails = async () => {
            if (!user?.companyId) {
                setLoading(false);
                return;
            }

            try {
                const data = await readCompany(user.companyId);
                if (data) {
                    setProfileData({
                        companyId: data.companyId || '',
                        name: data.name || '',
                        industry: data.industry || '',
                        contactEmail: data.contactEmail || '',
                        password: data.password || ''
                    });
                }
            } catch (err) {
                console.error("Failed to fetch company profile:", err);
                setMessage({ type: 'error', text: 'Could not load company profile from server.' });
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetails();
    }, [user]);

    // Handle Profile Update (Name, Industry, Contact Email)
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setSaving(true);

        try {
            const payload = {
                companyId: profileData.companyId,
                name: profileData.name.trim(),
                industry: profileData.industry.trim(),
                contactEmail: profileData.contactEmail.trim(),
                password: profileData.password // Retains existing hash
            };

            const result = await updateCompany(payload);

            if (result) {
                setProfileData(result);
                // Update global AuthContext session
                login({
                    ...user,
                    name: result.name,
                    email: result.contactEmail
                });
                setMessage({ type: 'success', text: 'Corporate profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update company profile.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: typeof err === 'string' ? err : 'Error updating profile.' });
        } finally {
            setSaving(false);
        }
    };

    // Handle Password Change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (securityData.newPassword !== securityData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match. Please verify.' });
            return;
        }

        setSaving(true);

        try {
            const payload = {
                companyId: profileData.companyId,
                name: profileData.name,
                industry: profileData.industry,
                contactEmail: profileData.contactEmail,
                password: securityData.newPassword // Service layer will re-hash this with BCrypt
            };

            const result = await updateCompany(payload);

            if (result) {
                setMessage({ type: 'success', text: 'Password updated successfully!' });
                setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update password.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error updating password.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Header */}
            <div className="border-b border-ui-border pb-4">
                <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/20 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-semibold mb-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Employer Portal</span>
                </div>
                <h1 className="font-heading text-2xl font-extrabold text-text-main">
                    Company Profile & Settings
                </h1>
                <p className="text-text-muted text-xs">
                    Manage your organization's public brand details and authentication security.
                </p>
            </div>

            {/* Alert Banner */}
            {message.text && (
                <div className={`flex items-center space-x-2 p-4 rounded-xl font-medium text-xs border shadow-sm ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-ui-border pb-2">
                <button
                    onClick={() => { setActiveTab('profile'); setMessage({ type: '', text: '' }); }}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'profile'
                            ? 'bg-brand-primary text-white shadow-md'
                            : 'text-text-muted hover:text-text-main hover:bg-card-bg'
                    }`}
                >
                    <Building2 className="w-4 h-4" />
                    <span>Corporate Details</span>
                </button>

                <button
                    onClick={() => { setActiveTab('security'); setMessage({ type: '', text: '' }); }}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'security'
                            ? 'bg-brand-primary text-white shadow-md'
                            : 'text-text-muted hover:text-text-main hover:bg-card-bg'
                    }`}
                >
                    <KeyRound className="w-4 h-4" />
                    <span>Security & Password</span>
                </button>
            </div>

            {/* TAB 1: CORPORATE DETAILS FORM */}
            {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="bg-card-bg border border-ui-border rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 className="font-heading font-bold text-text-main text-sm">Organization Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1">Company Registration ID (Read Only)</label>
                            <div className="relative">
                                <Hash className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                                <input
                                    type="text"
                                    value={profileData.companyId}
                                    disabled
                                    className="w-full bg-app-bg/60 border border-ui-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-brand-accent font-mono cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-muted mb-1">Company Name</label>
                            <div className="relative">
                                <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1">Corporate Contact Email</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                            <input
                                type="email"
                                value={profileData.contactEmail}
                                onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                                required
                                className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1">Industry Sector</label>
                        <div className="relative">
                            <Briefcase className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                            <input
                                type="text"
                                value={profileData.industry}
                                onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                                required
                                className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover shadow-md cursor-pointer transition-all disabled:opacity-50"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{saving ? 'Saving...' : 'Save Corporate Details'}</span>
                        </button>
                    </div>
                </form>
            )}

            {/* TAB 2: SECURITY FORM */}
            {activeTab === 'security' && (
                <form onSubmit={handlePasswordSubmit} className="bg-card-bg border border-ui-border rounded-2xl p-6 shadow-xl space-y-4 max-w-lg">
                    <h3 className="font-heading font-bold text-text-main text-sm">Change Employer Password</h3>

                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1">New Password</label>
                        <input
                            type="password"
                            value={securityData.newPassword}
                            onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                            placeholder="••••••••"
                            required
                            className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl px-4 py-2.5 text-xs text-text-main font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={securityData.confirmPassword}
                            onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            required
                            className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl px-4 py-2.5 text-xs text-text-main font-mono"
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover shadow-md cursor-pointer transition-all disabled:opacity-50"
                        >
                            {saving ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            )}

        </div>
    );
}