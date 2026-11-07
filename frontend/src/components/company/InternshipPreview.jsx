import { Briefcase, CalendarDays, Clock, MapPin, Users, Wallet } from 'lucide-react';
import { Badge, Card, CompanyLogo } from '../ui';
import { formatDate, formatStipend, workModeLabel } from '../../lib/format';
import { stipendValue } from './internshipFormUtils';

/** Live preview of how a listing will appear to students. */
export default function InternshipPreview({ values, companyName }) {
    const stipend = formatStipend(stipendValue(values));
    const duration = Number.parseInt(values.durationMonths, 10);
    const positions = Number.parseInt(values.positions, 10);

    return (
        <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-4">Listing preview</p>
            <div className="flex items-start gap-3">
                <CompanyLogo name={companyName} />
                <div className="min-w-0">
                    <h3 className="text-base font-semibold leading-snug break-words">{values.title.trim() || 'Internship title'}</h3>
                    <p className="text-sm text-text-muted">{companyName}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
                {workModeLabel(values.workMode) && <Badge tone="info">{workModeLabel(values.workMode)}</Badge>}
                {values.fieldOfStudy && <Badge>{values.fieldOfStudy}</Badge>}
                {stipend && <Badge tone={stipendValue(values) > 0 ? 'success' : 'muted'}>{stipend}</Badge>}
            </div>

            <dl className="mt-4 space-y-2 text-sm text-text-muted">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" />{values.location.trim() || 'Location'}</div>
                {values.startDate && <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 shrink-0" />Starts {formatDate(values.startDate)}</div>}
                {duration > 0 && <div className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" />{duration} month{duration === 1 ? '' : 's'}</div>}
                {positions > 0 && <div className="flex items-center gap-2"><Users className="w-4 h-4 shrink-0" />{positions} position{positions === 1 ? '' : 's'}</div>}
                {!stipend && <div className="flex items-center gap-2"><Wallet className="w-4 h-4 shrink-0" />Stipend not disclosed</div>}
                <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 shrink-0" />{values.deadline ? `Apply by ${formatDate(values.deadline)}` : 'No deadline set'}</div>
            </dl>

            <p className="mt-4 pt-4 border-t border-ui-border text-sm text-text-main whitespace-pre-line line-clamp-6">
                {values.description.trim() || 'Your description will appear here.'}
            </p>

            {values.requiredSkills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                    {values.requiredSkills.map((s) => <Badge key={s} tone="neutral">{s}</Badge>)}
                </div>
            )}
        </Card>
    );
}
