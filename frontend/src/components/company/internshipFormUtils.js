// Helpers shared by the post-internship page and the edit-posting modal.

export const WORK_MODES = [
    { value: 'ONSITE', label: 'On-site' },
    { value: 'HYBRID', label: 'Hybrid' },
    { value: 'REMOTE', label: 'Remote' },
];

export const emptyInternshipForm = () => ({
    title: '',
    fieldOfStudy: '',
    description: '',
    location: '',
    workMode: 'ONSITE',
    startDate: '',
    durationMonths: '6',
    positions: '1',
    stipend: '',
    unpaid: false,
    requiredSkills: [],
    deadline: '',
});

const toInputString = (v) => (v === null || v === undefined ? '' : String(v));

/** Raw Internship entity -> form values. */
export const toFormValues = (internship) => ({
    title: internship.title ?? '',
    fieldOfStudy: internship.fieldOfStudy ?? '',
    description: internship.description ?? '',
    location: internship.location ?? '',
    workMode: internship.workMode ?? 'ONSITE',
    startDate: internship.startDate ? String(internship.startDate).slice(0, 10) : '',
    durationMonths: toInputString(internship.durationMonths),
    positions: toInputString(internship.positions),
    stipend: internship.stipend ? String(internship.stipend) : '',
    unpaid: internship.stipend === 0,
    requiredSkills: Array.isArray(internship.requiredSkills) ? internship.requiredSkills : [],
    deadline: internship.deadline ? String(internship.deadline).slice(0, 10) : '',
});

const toIntOrNull = (v) => (v === '' || v === null || v === undefined ? null : Number.parseInt(v, 10));

export const stipendValue = (values) => (values.unpaid ? 0 : toIntOrNull(values.stipend));

/** Form values -> request body fields (without ids). */
export const toPayload = (values) => ({
    title: values.title.trim(),
    fieldOfStudy: values.fieldOfStudy || null,
    description: values.description.trim(),
    location: values.location.trim(),
    workMode: values.workMode || null,
    startDate: values.startDate || null,
    durationMonths: toIntOrNull(values.durationMonths),
    positions: toIntOrNull(values.positions),
    stipend: stipendValue(values),
    requiredSkills: values.requiredSkills,
    deadline: values.deadline ? `${values.deadline}T23:59:59` : null,
});

export const todayIso = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Returns an object of field -> message. Empty object means valid.
 * Pass `originalDeadline` and `originalStartDate` when editing so an unchanged past date is allowed.
 */
export const validateInternship = (values, { originalDeadline, originalStartDate } = {}) => {
    const errors = {};
    if (!values.title.trim()) errors.title = 'Give the internship a title.';
    if (values.description.trim().length < 30) errors.description = 'Describe the role in at least 30 characters.';
    if (!values.location.trim()) errors.location = 'Enter a location (city or "Remote").';
    if (!values.deadline) {
        errors.deadline = 'Choose an application deadline.';
    } else if (values.deadline < todayIso() && values.deadline !== originalDeadline) {
        errors.deadline = 'The deadline must be today or later.';
    }

    if (values.startDate) {
        if (values.startDate < todayIso() && values.startDate !== originalStartDate) {
            errors.startDate = 'Start date must be today or in the future.';
        } else if (values.deadline && values.startDate < values.deadline) {
            errors.startDate = 'Start date cannot be before the application deadline.';
        }
    }

    if (!values.unpaid && values.stipend !== '' && (Number.isNaN(Number(values.stipend)) || Number(values.stipend) < 0)) {
        errors.stipend = 'Stipend cannot be negative.';
    }
    const duration = toIntOrNull(values.durationMonths);
    if (duration !== null && (Number.isNaN(duration) || duration < 1 || duration > 24)) {
        errors.durationMonths = 'Use 1 to 24 months.';
    }
    const positions = toIntOrNull(values.positions);
    if (positions !== null && (Number.isNaN(positions) || positions < 1)) {
        errors.positions = 'At least 1 position.';
    }
    return errors;
};

export const generateInternshipId = () => `INT-${Date.now().toString().slice(-6)}`;
