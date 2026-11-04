import { Link } from 'react-router-dom';
import { MapPin, Wallet, CalendarClock, Users } from 'lucide-react';
import { Badge, CompanyLogo, Skeleton, cx } from '../ui';
import { daysUntil, deadlineLabel, formatStipend, timeAgo, workModeLabel } from '../../lib/format';

/** Card for an InternshipResponse; the whole card links to the details page. */
export default function InternshipCard({ internship, compact = false, className }) {
    const {
        internshipId, title, companyName, location, workMode, stipend,
        deadline, requiredSkills, applicantCount, createdAt, open,
    } = internship;

    const days = daysUntil(deadline);
    const closed = open === false || (days !== null && days < 0);
    const urgent = closed || (days !== null && days <= 3);
    const mode = workModeLabel(workMode);
    const pay = formatStipend(stipend);
    const skills = (requiredSkills ?? []).slice(0, 3);
    const applicants = applicantCount ?? 0;

    return (
        <Link
            to={`/internships/${internshipId}`}
            className={cx(
                'group block bg-card-bg border border-ui-border rounded-xl p-5 shadow-(--shadow-card) transition',
                'hover:border-primary-200 hover:shadow-(--shadow-pop) focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200',
                className,
            )}
        >
            <div className="flex items-start gap-4">
                <CompanyLogo name={companyName || title} />
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="text-base font-semibold text-text-main group-hover:text-primary-700 truncate">{title}</h3>
                            <p className="text-sm text-text-muted truncate">{companyName || 'Company'}</p>
                        </div>
                        {mode && <Badge tone="info" className="shrink-0">{mode}</Badge>}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-text-muted">
                        {location && (
                            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-text-subtle" />{location}</span>
                        )}
                        {pay && (
                            <span className="inline-flex items-center gap-1.5"><Wallet className="w-4 h-4 text-text-subtle" />{pay}</span>
                        )}
                        <span className={cx('inline-flex items-center gap-1.5', urgent && 'text-rose-600 font-medium')}>
                            <CalendarClock className={cx('w-4 h-4', urgent ? 'text-rose-500' : 'text-text-subtle')} />
                            {closed ? 'Closed' : deadlineLabel(deadline)}
                        </span>
                    </div>

                    {!compact && skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {skills.map((s) => <Badge key={s} tone="neutral">{s}</Badge>)}
                        </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-ui-border flex items-center justify-between gap-3 text-xs text-text-subtle">
                        <span className="inline-flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {applicants} applicant{applicants === 1 ? '' : 's'}
                        </span>
                        {createdAt && <span>Posted {timeAgo(createdAt)}</span>}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function InternshipCardSkeleton() {
    return (
        <div className="bg-card-bg border border-ui-border rounded-xl p-5">
            <div className="flex gap-4">
                <Skeleton className="w-11 h-11 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2.5">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3.5 w-1/3" />
                    <Skeleton className="h-3.5 w-3/4" />
                </div>
            </div>
        </div>
    );
}
