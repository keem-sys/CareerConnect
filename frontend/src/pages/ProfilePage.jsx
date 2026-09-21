import React, { useState, useEffect } from 'react';
import { X, Plus, User, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createProfile, updateProfile, getProfileByStudentNumber } from '../services/profileService';

export default function ProfilePage() {
    const { user } = useAuth();

    const [profileId, setProfileId] = useState(null);
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [resumeLink, setResumeLink] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // On page load, check if this student already has a saved profile.
    useEffect(() => {
        const loadExistingProfile = async () => {
            if (!user?.studentNumber) {
                setLoading(false);
                return;
            }
            try {
                const existing = await getProfileByStudentNumber(user.studentNumber);
                if (existing) {
                    setProfileId(existing.profileId);
                    setBio(existing.bio || '');
                    setSkills(existing.skills || []);
                    setResumeLink(existing.resumeLink || '');
                }
            } catch (err) {
                // No existing profile for this student yet - that's fine, show a blank form.
            } finally {
                setLoading(false);
            }
        };

        loadExistingProfile();
    }, [user]);

    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
        }
        setSkillInput('');
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill();
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter((s) => s !== skillToRemove));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!bio.trim() || skills.length === 0 || !resumeLink.trim()) {
            setMessage({ type: 'error', text: 'Bio, at least one skill, and a resume link are required.' });
            return;
        }

        if (!user?.studentNumber) {
            setMessage({ type: 'error', text: 'You must be logged in as a student to save a profile.' });
            return;
        }

        setSaving(true);
        try {
            if (profileId) {
                // Existing profile -> update it
                const payload = { profileId, studentNumber: user.studentNumber, bio, skills, resumeLink };
                await updateProfile(payload);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                // No existing profile -> create a new one
                const payload = { studentNumber: user.studentNumber, bio, skills, resumeLink };
                const saved = await createProfile(payload);
                setProfileId(saved.profileId);
                setMessage({ type: 'success', text: 'Profile saved successfully!' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 text-center text-text-muted">
                Loading your profile...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card-bg border border-ui-border rounded-2xl shadow-sm p-6">
                <h1 className="font-heading text-2xl font-bold text-text-main mb-1">
                    {profileId ? 'Edit Your Profile' : 'Build Your Profile'}
                </h1>
                <p className="text-text-muted text-sm mb-6">
                    Add your bio, skills, and links so companies can find you.
                </p>

                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-1">
                            Bio
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            placeholder="Tell companies a bit about yourself..."
                            className="w-full rounded-xl border border-ui-border bg-app-bg px-3 py-2 text-text-main placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main mb-1">
                            Skills
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                                placeholder="e.g. Java, Spring Boot, React"
                                className="flex-1 rounded-xl border border-ui-border bg-app-bg px-3 py-2 text-text-main placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="flex items-center justify-center rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white px-3 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="flex items-center gap-1 bg-emerald-50 text-brand-mint border border-emerald-200 rounded-xl px-3 py-1 text-sm font-mono"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="hover:text-rose-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main mb-1">
                            CV / Resume Link
                        </label>
                        <input
                            type="url"
                            value={resumeLink}
                            onChange={(e) => setResumeLink(e.target.value)}
                            placeholder="https://example.com/resume.pdf"
                            className="w-full rounded-xl border border-ui-border bg-app-bg px-3 py-2 text-text-main placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main mb-1">
                            LinkedIn Profile URL
                        </label>
                        <input
                            type="url"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            placeholder="https://linkedin.com/in/yourname"
                            className="w-full rounded-xl border border-ui-border bg-app-bg px-3 py-2 text-text-main placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        />
                    </div>

                    {message && (
                        <div
                            className={
                                message.type === 'success'
                                    ? 'bg-emerald-50 text-brand-mint border border-emerald-200 rounded-xl px-3 py-2 text-sm'
                                    : 'text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-sm'
                            }
                        >
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-medium rounded-xl py-2.5 transition-colors disabled:opacity-60"
                    >
                        {saving ? 'Saving...' : profileId ? 'Update Profile' : 'Save Profile'}
                    </button>
                </form>
            </div>

            <div className="bg-card-bg border border-ui-border rounded-2xl shadow-sm p-6 h-fit">
                <h2 className="font-heading text-lg font-bold text-text-main mb-4">
                    Preview
                </h2>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white">
                        <User size={22} />
                    </div>
                    <div>
                        <p className="font-heading font-semibold text-text-main">
                            {user?.name || 'Student Name'}
                        </p>
                        <p className="text-text-subtle text-sm font-mono">
                            {user?.studentNumber || 'Student Number'}
                        </p>
                    </div>
                </div>

                <p className="text-text-main text-sm mb-4">
                    {bio || <span className="text-text-subtle">Your bio will appear here.</span>}
                </p>

                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="bg-emerald-50 text-brand-mint border border-emerald-200 rounded-xl px-3 py-1 text-xs font-mono"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}

                <div className="space-y-2 text-sm">
                    {resumeLink && (
                        <a
                            href={resumeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-brand-accent hover:underline"
                        >
                            <LinkIcon size={16} /> Resume / CV
                        </a>
                    )}
                    {linkedinUrl && (
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-brand-accent hover:underline"
                        >
                            <LinkIcon size={16} /> LinkedIn Profile
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
