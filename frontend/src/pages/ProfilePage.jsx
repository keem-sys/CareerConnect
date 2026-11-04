import { useEffect, useState } from 'react';
import { X, Mail, Hash, Link as LinkIcon, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { createProfile, updateProfile, getProfileByStudentNumber } from '../services/profileService';
import { readStudent, updateStudent } from '../services/studentService';
import {
    PageContainer, PageHeader, Card, CardHeader, Button, Field, Input, Textarea, Avatar, ProgressBar,
    Skeleton, Alert, Badge,
} from '../components/ui';
import { errorMessage } from '../lib/format';

const BIO_MAX = 255;
const SKILL_MAX = 40;
const SKILLS_LIMIT = 20;

const isValidUrl = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

async function loadProfile(studentNumber) {
    try {
        return (await getProfileByStudentNumber(studentNumber)) || null;
    } catch (err) {
        if (err.response?.status === 404) return null;
        throw err;
    }
}

function validateProfile({ bio, skills, resumeLink }) {
    const errors = {};
    if (!bio.trim()) errors.bio = 'Tell employers a little about yourself.';
    else if (bio.length > BIO_MAX) errors.bio = `Keep your bio under ${BIO_MAX} characters.`;
    if (skills.length === 0) errors.skills = 'Add at least one skill.';
    if (!resumeLink.trim()) errors.resumeLink = 'Add a link to your CV or LinkedIn profile.';
    else if (!isValidUrl(resumeLink.trim())) errors.resumeLink = 'Enter a valid link starting with https://';
    return errors;
}

export default function ProfilePage() {
    const { user, login } = useAuth();
    const { toast } = useToast();
    const studentNumber = user?.id;

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [account, setAccount] = useState({ name: user?.name ?? '', email: user?.email ?? '' });
    const [name, setName] = useState(user?.name ?? '');
    const [nameError, setNameError] = useState(null);
    const [savingAccount, setSavingAccount] = useState(false);

    const [profileId, setProfileId] = useState(null);
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [resumeLink, setResumeLink] = useState('');
    const [errors, setErrors] = useState({});
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        if (!studentNumber) return undefined;
        let cancelled = false;
        Promise.all([readStudent(studentNumber).catch(() => null), loadProfile(studentNumber)])
            .then(([student, profile]) => {
                if (cancelled) return;
                if (student) {
                    setAccount({ name: student.name ?? '', email: student.email ?? '' });
                    setName(student.name ?? '');
                }
                if (profile) {
                    setProfileId(profile.profileId);
                    setBio(profile.bio ?? '');
                    setSkills(profile.skills ?? []);
                    setResumeLink(profile.resumeLink ?? '');
                }
            })
            .catch((err) => { if (!cancelled) setLoadError(errorMessage(err, 'Could not load your profile.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [studentNumber]);

    const completedItems = [Boolean(bio.trim()), skills.length > 0, Boolean(resumeLink.trim())];
    const completeness = Math.round((completedItems.filter(Boolean).length / completedItems.length) * 100);

    const addSkill = () => {
        const value = skillInput.trim().replace(/,$/, '');
        if (!value) return;
        if (value.length > SKILL_MAX) {
            setErrors((e) => ({ ...e, skills: `Skills must be ${SKILL_MAX} characters or fewer.` }));
            return;
        }
        if (skills.length >= SKILLS_LIMIT) {
            setErrors((e) => ({ ...e, skills: `You can add up to ${SKILLS_LIMIT} skills.` }));
            return;
        }
        if (!skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
            setSkills((list) => [...list, value]);
        }
        setSkillInput('');
        setErrors((e) => ({ ...e, skills: undefined }));
    };

    const onSkillKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill();
        } else if (e.key === 'Backspace' && !skillInput && skills.length > 0) {
            setSkills((list) => list.slice(0, -1));
        }
    };

    const removeSkill = (skill) => setSkills((list) => list.filter((s) => s !== skill));

    const saveProfile = async (e) => {
        e.preventDefault();
        const pending = skillInput.trim();
        const allSkills = pending && !skills.some((s) => s.toLowerCase() === pending.toLowerCase())
            ? [...skills, pending]
            : skills;
        const data = { bio: bio.trim(), skills: allSkills, resumeLink: resumeLink.trim() };
        const found = validateProfile(data);
        setErrors(found);
        if (Object.keys(found).length > 0) return;
        setSkills(allSkills);
        setSkillInput('');

        setSavingProfile(true);
        try {
            if (profileId) {
                await updateProfile({ profileId, studentNumber, ...data });
                toast('Profile updated', 'success');
            } else {
                const saved = await createProfile({ studentNumber, ...data });
                if (!saved?.profileId) throw new Error('The profile could not be created. Please check your details.');
                setProfileId(saved.profileId);
                toast('Profile created', 'success');
            }
        } catch (err) {
            toast(errorMessage(err, 'Could not save your profile.'), 'error');
        } finally {
            setSavingProfile(false);
        }
    };

    const saveAccount = async (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed.length < 2) {
            setNameError('Enter your full name.');
            return;
        }
        setNameError(null);
        setSavingAccount(true);
        try {
            const updated = await updateStudent({ studentNumber, name: trimmed, email: account.email });
            const newName = updated?.name ?? trimmed;
            setAccount((a) => ({ ...a, name: newName }));
            setName(newName);
            login({ ...user, name: newName });
            toast('Account details updated', 'success');
        } catch (err) {
            toast(errorMessage(err, 'Could not update your account.'), 'error');
        } finally {
            setSavingAccount(false);
        }
    };

    if (loading) {
        return (
            <PageContainer className="max-w-5xl">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-72 mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-96 w-full rounded-xl lg:col-span-2" />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="max-w-5xl">
            <PageHeader title="My profile" subtitle="This is what employers see when you apply for an internship." />

            {loadError && <Alert className="mb-6">{loadError}</Alert>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="space-y-6">
                    <Card>
                        <div className="flex flex-col items-center text-center">
                            <Avatar name={account.name} size="lg" />
                            <h2 className="mt-3 text-lg font-semibold">{account.name || 'Student'}</h2>
                            <div className="mt-2 space-y-1 text-sm text-text-muted">
                                <p className="flex items-center justify-center gap-1.5"><Mail className="w-4 h-4" />{account.email}</p>
                                <p className="flex items-center justify-center gap-1.5"><Hash className="w-4 h-4" />{studentNumber}</p>
                            </div>
                        </div>
                        <div className="mt-6 pt-5 border-t border-ui-border">
                            <div className="flex items-center justify-between mb-2 text-sm">
                                <span className="font-medium">Profile completeness</span>
                                <span className="text-text-muted">{completeness}%</span>
                            </div>
                            <ProgressBar value={completeness} />
                            {completeness >= 100 ? (
                                <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-700">
                                    <CheckCircle2 className="w-4 h-4" /> Your profile is complete
                                </p>
                            ) : (
                                <p className="mt-3 text-sm text-text-muted">Add a bio, skills and a CV link to stand out.</p>
                            )}
                            {!profileId && completeness >= 100 && (
                                <p className="mt-1 text-sm text-text-muted">Remember to save your profile.</p>
                            )}
                        </div>
                        {resumeLink && isValidUrl(resumeLink) && (
                            <Button href={resumeLink} target="_blank" rel="noreferrer" variant="secondary" icon={ExternalLink} className="mt-5 w-full">
                                Open CV / LinkedIn
                            </Button>
                        )}
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader
                            title="Professional profile"
                            subtitle={profileId ? 'Keep your details up to date.' : 'You have not created a profile yet. Fill in the details below to get started.'}
                        />
                        <form onSubmit={saveProfile} className="space-y-5" noValidate>
                            <Field
                                label="Bio"
                                htmlFor="bio"
                                required
                                error={errors.bio}
                                hint={`${bio.length}/${BIO_MAX} characters`}
                            >
                                <Textarea
                                    id="bio"
                                    rows={4}
                                    maxLength={BIO_MAX}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="e.g. Final-year Diploma in ICT student passionate about backend development and cloud."
                                    className={errors.bio ? 'border-rose-400' : undefined}
                                />
                            </Field>

                            <Field
                                label="Skills"
                                htmlFor="skills"
                                required
                                error={errors.skills}
                                hint="Type a skill and press Enter to add it."
                            >
                                <div
                                    className={`flex flex-wrap items-center gap-2 rounded-lg border bg-white px-2 py-2 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 ${errors.skills ? 'border-rose-400' : 'border-ui-border'}`}
                                >
                                    {skills.map((skill) => (
                                        <span key={skill} className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-sm font-medium text-primary-700">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="rounded text-primary-500 hover:text-primary-800 cursor-pointer"
                                                aria-label={`Remove ${skill}`}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        id="skills"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={onSkillKeyDown}
                                        onBlur={addSkill}
                                        placeholder={skills.length ? 'Add another skill' : 'e.g. Java, React, SQL'}
                                        className="flex-1 min-w-32 h-7 px-1 text-sm outline-none bg-transparent placeholder:text-text-subtle"
                                    />
                                </div>
                            </Field>

                            <Field
                                label="CV or LinkedIn link"
                                htmlFor="resumeLink"
                                required
                                error={errors.resumeLink}
                                hint="A public link to your CV (Google Drive, OneDrive) or your LinkedIn profile."
                            >
                                <Input
                                    id="resumeLink"
                                    type="url"
                                    icon={LinkIcon}
                                    value={resumeLink}
                                    onChange={(e) => setResumeLink(e.target.value)}
                                    placeholder="https://www.linkedin.com/in/your-name"
                                    invalid={Boolean(errors.resumeLink)}
                                />
                            </Field>

                            <div className="flex justify-end">
                                <Button type="submit" loading={savingProfile}>
                                    {profileId ? 'Save changes' : 'Create profile'}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card>
                        <CardHeader title="Account" subtitle="Your sign-in details." />
                        <form onSubmit={saveAccount} className="space-y-5" noValidate>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Full name" htmlFor="name" required error={nameError}>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        invalid={Boolean(nameError)}
                                        autoComplete="name"
                                    />
                                </Field>
                                <Field label="Email" htmlFor="email" hint="Your CPUT email cannot be changed.">
                                    <Input id="email" value={account.email} disabled readOnly />
                                </Field>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <Badge tone="neutral">Student number {studentNumber}</Badge>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    loading={savingAccount}
                                    disabled={name.trim() === account.name}
                                >
                                    Update name
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
