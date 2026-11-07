import { useState } from 'react';
import { X } from 'lucide-react';
import { Card, Field, Input, Select, Textarea, cx } from '../ui';
import { FIELDS_OF_STUDY } from '../../lib/format';
import { WORK_MODES, todayIso } from './internshipFormUtils';

function Section({ title, description, plain, children }) {
    const body = (
        <>
            <div className="mb-4">
                <h3 className="text-base font-semibold">{title}</h3>
                {description && <p className="text-sm text-text-muted mt-0.5">{description}</p>}
            </div>
            <div className="space-y-4">{children}</div>
        </>
    );
    if (plain) return <section className="pb-6 border-b border-ui-border last:border-b-0 last:pb-0">{body}</section>;
    return <Card>{body}</Card>;
}

function SkillsInput({ id, skills, onChange }) {
    const [draft, setDraft] = useState('');

    const add = (raw) => {
        const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
        if (parts.length === 0) return;
        const next = [...skills];
        parts.forEach((p) => {
            if (!next.some((s) => s.toLowerCase() === p.toLowerCase())) next.push(p);
        });
        onChange(next);
        setDraft('');
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add(draft);
        } else if (e.key === 'Backspace' && !draft && skills.length > 0) {
            onChange(skills.slice(0, -1));
        }
    };

    return (
        <div className="rounded-lg border border-ui-border bg-white px-2 py-1.5 flex flex-wrap gap-1.5 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition">
            {skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 rounded-md bg-primary-50 text-primary-700 px-2 py-1 text-sm">
                    {skill}
                    <button
                        type="button"
                        onClick={() => onChange(skills.filter((s) => s !== skill))}
                        className="text-primary-500 hover:text-primary-800 cursor-pointer"
                        aria-label={`Remove ${skill}`}
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </span>
            ))}
            <input
                id={id}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={() => add(draft)}
                placeholder={skills.length ? 'Add another skill' : 'e.g. Java, React, SQL'}
                className="flex-1 min-w-32 h-8 px-1 text-sm outline-none bg-transparent placeholder:text-text-subtle"
            />
        </div>
    );
}

/**
 * Controlled internship form. `plain` renders sections without cards (used inside the edit modal).
 */
export default function InternshipForm({ values, errors = {}, onChange, plain = false, idPrefix = 'internship' }) {
    const set = (field) => (e) => onChange({ ...values, [field]: e.target.value });
    const id = (field) => `${idPrefix}-${field}`;

    return (
        <div className={plain ? 'space-y-6' : 'space-y-5'}>
            <Section title="Basics" description="What is the role and who is it for?" plain={plain}>
                <Field label="Internship title" htmlFor={id('title')} error={errors.title} required>
                    <Input id={id('title')} value={values.title} onChange={set('title')} invalid={!!errors.title} placeholder="e.g. Junior Software Developer Intern" maxLength={120} />
                </Field>
                <Field label="Field of study" htmlFor={id('field')} hint="Helps students filter for relevant roles.">
                    <Select id={id('field')} value={values.fieldOfStudy} onChange={set('fieldOfStudy')}>
                        <option value="">Any field</option>
                        {FIELDS_OF_STUDY.map((f) => <option key={f} value={f}>{f}</option>)}
                    </Select>
                </Field>
                <Field
                    label="Description"
                    htmlFor={id('description')}
                    error={errors.description}
                    hint={`${values.description.trim().length}/1000 characters. Describe the team, daily tasks and what the intern will learn.`}
                    required
                >
                    <Textarea id={id('description')} rows={6} value={values.description} onChange={set('description')} maxLength={1000} className={errors.description ? 'border-rose-400' : undefined} />
                </Field>
            </Section>

            <Section title="Logistics" description="Where, when and how many." plain={plain}>
                <Field label="Location" htmlFor={id('location')} error={errors.location} required>
                    <Input id={id('location')} value={values.location} onChange={set('location')} invalid={!!errors.location} placeholder="e.g. Cape Town" />
                </Field>
                <Field label="Work mode">
                    <div className="inline-flex rounded-lg border border-ui-border bg-slate-50 p-1" role="radiogroup" aria-label="Work mode">
                        {WORK_MODES.map((m) => (
                            <button
                                key={m.value}
                                type="button"
                                role="radio"
                                aria-checked={values.workMode === m.value}
                                onClick={() => onChange({ ...values, workMode: m.value })}
                                className={cx(
                                    'px-4 h-8 rounded-md text-sm font-medium transition-colors cursor-pointer',
                                    values.workMode === m.value ? 'bg-white text-primary-700 shadow-sm ring-1 ring-ui-border' : 'text-text-muted hover:text-text-main',
                                )}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Start date" htmlFor={id('start')} error={errors.startDate}>
                        <Input
                            id={id('start')}
                            type="date"
                            min={values.deadline || todayIso()}
                            value={values.startDate}
                            onChange={set('startDate')}
                            invalid={!!errors.startDate}
                        />
                    </Field>
                    <Field label="Duration (months)" htmlFor={id('duration')} error={errors.durationMonths}>
                        <Input id={id('duration')} type="number" min={1} max={24} value={values.durationMonths} onChange={set('durationMonths')} invalid={!!errors.durationMonths} />
                    </Field>
                    <Field label="Positions" htmlFor={id('positions')} error={errors.positions}>
                        <Input id={id('positions')} type="number" min={1} value={values.positions} onChange={set('positions')} invalid={!!errors.positions} />
                    </Field>
                </div>
            </Section>

            <Section title="Compensation" description="Listings with a stipend attract more applicants." plain={plain}>
                <Field label="Monthly stipend (ZAR)" htmlFor={id('stipend')} error={errors.stipend} hint="Leave blank if not disclosed.">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted pointer-events-none">R</span>
                        <Input
                            id={id('stipend')}
                            type="number"
                            min={0}
                            step={100}
                            value={values.unpaid ? '' : values.stipend}
                            onChange={set('stipend')}
                            disabled={values.unpaid}
                            invalid={!!errors.stipend}
                            className="pl-7"
                            placeholder={values.unpaid ? 'Unpaid' : 'e.g. 8000'}
                        />
                    </div>
                </Field>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={values.unpaid}
                        onChange={(e) => onChange({ ...values, unpaid: e.target.checked })}
                        className="w-4 h-4 rounded border-ui-border text-primary-600 focus:ring-primary-200"
                    />
                    This internship is unpaid
                </label>
            </Section>

            <Section title="Requirements" description="Press Enter or comma to add each skill." plain={plain}>
                <Field label="Required skills" htmlFor={id('skills')}>
                    <SkillsInput id={id('skills')} skills={values.requiredSkills} onChange={(requiredSkills) => onChange({ ...values, requiredSkills })} />
                </Field>
            </Section>

            <Section title="Deadline" description="Applications close at 23:59 on this date." plain={plain}>
                <Field label="Application deadline" htmlFor={id('deadline')} error={errors.deadline} required>
                    <Input id={id('deadline')} type="date" min={todayIso()} value={values.deadline} onChange={set('deadline')} invalid={!!errors.deadline} className="sm:max-w-xs" />
                </Field>
            </Section>
        </div>
    );
}
