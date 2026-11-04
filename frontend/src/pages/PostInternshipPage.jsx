import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createInternship } from '../services/internshipService';
import { Briefcase, Calendar, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function PostInternshipPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        deadline: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    if (!user || user.role === 'STUDENT') {
        return (
            <div className="min-h-[calc(100vh-5rem)] bg-app-bg flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-card-bg border border-ui-border rounded-2xl p-8 text-center shadow-xl space-y-4">
                    <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
                    <h3 className="font-heading font-bold text-text-main text-lg">Access Denied</h3>
                    <p className="text-text-muted text-xs">Only registered employers (Companies) are authorized to post internship listings.</p>
                    <button
                        onClick={() => navigate('/internships')}
                        className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                        Back to Internships
                    </button>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!formData.title || !formData.description || !formData.location || !formData.deadline) {
            setMessage({ type: 'error', text: 'Please fill in all required fields.' });
            return;
        }

        const generatedId = `INT-${Date.now().toString().slice(-6)}`;
        setLoading(true);

        try {
            await createInternship({
                internshipId: generatedId,
                companyId: user.companyId,
                title: formData.title.trim(),
                description: formData.description.trim(),
                location: formData.location.trim(),
                deadline: formData.deadline // datetime-local format maps directly to LocalDateTime
            });

            setMessage({ type: 'success', text: 'Internship posted successfully!' });
            setFormData({ title: '', description: '', location: '', deadline: '' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: typeof error === 'string' ? error : 'Failed to create internship. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-app-bg p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-2xl space-y-6">

                {/* Header */}
                <div className="border-b border-ui-border pb-4">
                    <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/20 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-semibold mb-2">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Employer Portal</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-text-main font-heading">
                        Post an Internship
                    </h1>
                    <p className="mt-1 text-xs text-text-muted">
                        Create a new Work-Integrated Learning (WIL) opportunity for CPUT students.
                    </p>
                </div>

                {/* Feedback Message Banner */}
                {message.text && (
                    <div className={`flex items-center space-x-2 p-4 rounded-xl font-medium text-xs border shadow-sm ${
                        message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : 'bg-rose-50 text-rose-900 border-rose-200'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        ) : (
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-ui-border bg-card-bg p-6 sm:p-8 shadow-xl space-y-4"
                >
                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1.5">
                            Internship Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Software Developer Intern"
                            required
                            className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl px-4 py-2.5 text-xs text-text-main placeholder-text-muted/60 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1.5">
                            Description & Requirements
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the role, tech stack, and responsibilities..."
                            rows="5"
                            required
                            className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl p-3 text-xs text-text-main placeholder-text-muted/60 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1.5">
                            Location
                        </label>
                        <div className="relative">
                            <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Cape Town (Hybrid / Remote)"
                                required
                                className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main placeholder-text-muted/60 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1.5">
                            Application Deadline
                        </label>
                        <div className="relative">
                            <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                            <input
                                type="datetime-local"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                                className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main focus:outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Posting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Publish Internship</span>
                                    <Briefcase className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}