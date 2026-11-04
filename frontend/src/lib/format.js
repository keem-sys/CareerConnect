// Shared display helpers so every page formats data the same way.

export const APPLICATION_STATUSES = ['PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];

export const STATUS_META = {
    PENDING: { label: 'Submitted', tone: 'neutral', description: 'Waiting for the employer to review' },
    UNDER_REVIEW: { label: 'Under review', tone: 'info', description: 'The employer is reviewing your application' },
    SHORTLISTED: { label: 'Shortlisted', tone: 'purple', description: 'You made the shortlist. Expect to hear about an interview' },
    ACCEPTED: { label: 'Offer', tone: 'success', description: 'Congratulations! You received an offer' },
    REJECTED: { label: 'Not selected', tone: 'danger', description: 'The employer went with other candidates' },
    WITHDRAWN: { label: 'Withdrawn', tone: 'muted', description: 'You withdrew this application' },
};

// Mirrors ApplicationStatus.allowedNext() on the backend (employer actions only).
export const NEXT_STATUSES = {
    PENDING: ['UNDER_REVIEW', 'SHORTLISTED', 'REJECTED'],
    UNDER_REVIEW: ['SHORTLISTED', 'ACCEPTED', 'REJECTED'],
    SHORTLISTED: ['ACCEPTED', 'REJECTED'],
    ACCEPTED: [],
    REJECTED: [],
    WITHDRAWN: [],
};

export const ACTIVE_STATUSES = ['PENDING', 'UNDER_REVIEW', 'SHORTLISTED'];

export const statusLabel = (status) => STATUS_META[status]?.label ?? status ?? 'Unknown';

export const WORK_MODE_LABELS = { ONSITE: 'On-site', HYBRID: 'Hybrid', REMOTE: 'Remote' };
export const workModeLabel = (mode) => WORK_MODE_LABELS[mode] ?? null;

export const FIELDS_OF_STUDY = [
    'Software Development',
    'Data Science',
    'Cloud Computing',
    'Networking & Security',
    'Information Systems',
    'Multimedia & Design',
];

export const formatStipend = (amount) => {
    if (amount === null || amount === undefined) return null;
    if (amount === 0) return 'Unpaid';
    return `R${Number(amount).toLocaleString('en-ZA')} / month`;
};

export const formatDate = (value, opts = { day: 'numeric', month: 'short', year: 'numeric' }) => {
    if (!value) return '—';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-ZA', opts);
};

export const timeAgo = (value) => {
    if (!value) return '';
    const diff = Date.now() - new Date(value).getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(value);
};

export const daysUntil = (value) => {
    if (!value) return null;
    return Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
};

export const deadlineLabel = (value) => {
    const days = daysUntil(value);
    if (days === null) return 'No deadline';
    if (days < 0) return 'Closed';
    if (days === 0) return 'Closes today';
    if (days === 1) return 'Closes tomorrow';
    return `Closes in ${days} days`;
};

export const initials = (name) =>
    (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export const errorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
    if (!err) return fallback;
    if (typeof err === 'string') return err;
    const data = err.response?.data ?? err;
    if (typeof data === 'string') return data;
    return data?.message || data?.error || err.message || fallback;
};
