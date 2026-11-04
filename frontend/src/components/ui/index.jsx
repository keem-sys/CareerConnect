/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, X, Inbox } from 'lucide-react';
import { STATUS_META, initials } from '../../lib/format';

export const cx = (...classes) => classes.filter(Boolean).join(' ');

/* ---------- Button ---------- */
const BUTTON_VARIANTS = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
    secondary: 'bg-white text-text-main border border-ui-border hover:bg-slate-50 shadow-sm',
    ghost: 'text-text-muted hover:text-text-main hover:bg-slate-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
    'danger-outline': 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
};
const BUTTON_SIZES = {
    sm: 'h-8 px-3 text-[13px] gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
};

export function Button({ variant = 'primary', size = 'md', loading = false, icon: Icon, to, href, className, children, disabled, ...props }) {
    const classes = cx(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
    );
    const content = (
        <>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
            {children}
        </>
    );
    if (to) return <Link to={to} className={classes} {...props}>{content}</Link>;
    if (href) return <a href={href} className={classes} {...props}>{content}</a>;
    return <button className={classes} disabled={disabled || loading} {...props}>{content}</button>;
}

/* ---------- Card ---------- */
export function Card({ className, children, padding = true, hover = false, ...props }) {
    return (
        <div
            className={cx(
                'bg-card-bg border border-ui-border rounded-xl shadow-(--shadow-card)',
                padding && 'p-5 sm:p-6',
                hover && 'transition hover:border-primary-200 hover:shadow-(--shadow-pop)',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, action, className }) {
    return (
        <div className={cx('flex items-start justify-between gap-4 mb-4', className)}>
            <div>
                <h3 className="text-base font-semibold">{title}</h3>
                {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

/* ---------- Badge ---------- */
const BADGE_TONES = {
    neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
    muted: 'bg-slate-50 text-slate-500 ring-slate-200',
    info: 'bg-primary-50 text-primary-700 ring-primary-100',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    danger: 'bg-rose-50 text-rose-700 ring-rose-200',
    purple: 'bg-violet-50 text-violet-700 ring-violet-200',
};

export function Badge({ tone = 'neutral', icon: Icon, className, children }) {
    return (
        <span className={cx('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset', BADGE_TONES[tone], className)}>
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {children}
        </span>
    );
}

export function StatusBadge({ status, className }) {
    const meta = STATUS_META[status] ?? { label: status ?? 'Unknown', tone: 'neutral' };
    return <Badge tone={meta.tone} className={className}>{meta.label}</Badge>;
}

/* ---------- Form controls ---------- */
const CONTROL = 'w-full rounded-lg border border-ui-border bg-white px-3 text-sm text-text-main placeholder:text-text-subtle transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none disabled:bg-slate-50 disabled:text-text-muted';

export function Field({ label, htmlFor, hint, error, required, children, className }) {
    return (
        <div className={cx('space-y-1.5', className)}>
            {label && (
                <label htmlFor={htmlFor} className="block text-sm font-medium text-text-main">
                    {label}{required && <span className="text-rose-600 ml-0.5">*</span>}
                </label>
            )}
            {children}
            {error ? <p className="text-xs text-rose-600">{error}</p> : hint ? <p className="text-xs text-text-muted">{hint}</p> : null}
        </div>
    );
}

export const Input = React.forwardRef(function Input({ className, icon: Icon, invalid, ...props }, ref) {
    if (Icon) {
        return (
            <div className="relative">
                <Icon className="w-4 h-4 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input ref={ref} className={cx(CONTROL, 'h-10 pl-9', invalid && 'border-rose-400', className)} {...props} />
            </div>
        );
    }
    return <input ref={ref} className={cx(CONTROL, 'h-10', invalid && 'border-rose-400', className)} {...props} />;
});

export function Select({ className, children, ...props }) {
    return <select className={cx(CONTROL, 'h-10 pr-8 cursor-pointer', className)} {...props}>{children}</select>;
}

export function Textarea({ className, ...props }) {
    return <textarea className={cx(CONTROL, 'py-2.5 min-h-24 resize-y', className)} {...props} />;
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;
    const width = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }[size];
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
            <div role="dialog" aria-modal="true" className={cx('relative w-full bg-white rounded-xl shadow-(--shadow-pop) animate-fade-in max-h-[90vh] flex flex-col', width)}>
                <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-ui-border">
                    <div>
                        <h2 className="text-lg font-semibold">{title}</h2>
                        {description && <p className="text-sm text-text-muted mt-0.5">{description}</p>}
                    </div>
                    <button onClick={onClose} className="p-1 rounded-md text-text-subtle hover:text-text-main hover:bg-slate-100 cursor-pointer" aria-label="Close">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto">{children}</div>
                {footer && <div className="px-6 py-4 border-t border-ui-border bg-slate-50/60 rounded-b-xl flex justify-end gap-2">{footer}</div>}
            </div>
        </div>
    );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'danger', loading }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
                </>
            }
        >
            <p className="text-sm text-text-muted">{message}</p>
        </Modal>
    );
}

/* ---------- Feedback ---------- */
export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
    return (
        <div className={cx('flex flex-col items-center text-center py-12 px-6', className)}>
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-text-subtle mb-4">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
            {description && <p className="text-sm text-text-muted mt-1 max-w-sm">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

export function Skeleton({ className }) {
    return <div className={cx('animate-pulse rounded-md bg-slate-200/70', className)} />;
}

export function Spinner({ className, label }) {
    return (
        <div className={cx('flex items-center justify-center gap-2 text-text-muted text-sm py-10', className)}>
            <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
            {label}
        </div>
    );
}

export function Alert({ tone = 'danger', title, children, className }) {
    const tones = {
        danger: 'bg-rose-50 border-rose-200 text-rose-800',
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        info: 'bg-primary-50 border-primary-100 text-primary-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
    };
    return (
        <div className={cx('rounded-lg border px-4 py-3 text-sm', tones[tone], className)}>
            {title && <p className="font-semibold">{title}</p>}
            {children}
        </div>
    );
}

/* ---------- Data display ---------- */
export function StatCard({ label, value, icon: Icon, hint, tone = 'primary', loading }) {
    const tones = {
        primary: 'bg-primary-50 text-primary-600',
        success: 'bg-emerald-50 text-emerald-600',
        warning: 'bg-amber-50 text-amber-600',
        purple: 'bg-violet-50 text-violet-600',
        neutral: 'bg-slate-100 text-slate-600',
    };
    return (
        <Card className="flex items-start gap-4">
            {Icon && (
                <div className={cx('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', tones[tone])}>
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <div className="min-w-0">
                <p className="text-sm text-text-muted">{label}</p>
                {loading ? <Skeleton className="h-7 w-16 mt-1" /> : <p className="text-2xl font-bold tracking-tight mt-0.5">{value}</p>}
                {hint && <p className="text-xs text-text-subtle mt-1">{hint}</p>}
            </div>
        </Card>
    );
}

const LOGO_COLORS = ['bg-primary-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600', 'bg-sky-600', 'bg-teal-600', 'bg-indigo-600'];
const colorFor = (seed = '') => LOGO_COLORS[[...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % LOGO_COLORS.length];

export function CompanyLogo({ name, size = 'md', className }) {
    const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-16 h-16 text-xl' };
    return (
        <div className={cx('rounded-lg flex items-center justify-center text-white font-bold shrink-0', colorFor(name), sizes[size], className)}>
            {initials(name)}
        </div>
    );
}

export function Avatar({ name, size = 'md', className }) {
    const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' };
    return (
        <div className={cx('rounded-full flex items-center justify-center font-semibold shrink-0 bg-primary-100 text-primary-700', sizes[size], className)}>
            {initials(name)}
        </div>
    );
}

export function PageHeader({ title, subtitle, actions, breadcrumb }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
                {breadcrumb && <div className="text-sm text-text-muted mb-1">{breadcrumb}</div>}
                <h1 className="text-2xl sm:text-[28px] font-bold">{title}</h1>
                {subtitle && <p className="text-text-muted mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
    );
}

export function PageContainer({ className, children }) {
    return <div className={cx('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', className)}>{children}</div>;
}

export function Tabs({ tabs, value, onChange, className }) {
    return (
        <div className={cx('flex gap-1 border-b border-ui-border overflow-x-auto', className)}>
            {tabs.map((t) => (
                <button
                    key={t.value}
                    onClick={() => onChange(t.value)}
                    className={cx(
                        'px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors',
                        value === t.value ? 'border-primary-600 text-primary-700' : 'border-transparent text-text-muted hover:text-text-main',
                    )}
                >
                    {t.label}
                    {t.count !== undefined && (
                        <span className={cx('ml-1.5 rounded-full px-1.5 py-0.5 text-xs', value === t.value ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-text-muted')}>
                            {t.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

export function Table({ columns, rows, rowKey, empty, onRowClick }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-ui-border text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                        {columns.map((c) => <th key={c.key} className={cx('px-4 py-3', c.className)}>{c.header}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-ui-border">
                    {rows.length === 0 ? (
                        <tr><td colSpan={columns.length}>{empty}</td></tr>
                    ) : rows.map((row) => (
                        <tr key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined} className={cx('hover:bg-slate-50/70', onRowClick && 'cursor-pointer')}>
                            {columns.map((c) => <td key={c.key} className={cx('px-4 py-3 align-middle', c.className)}>{c.render ? c.render(row) : row[c.key]}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function ProgressBar({ value, className }) {
    const pct = Math.max(0, Math.min(100, value ?? 0));
    return (
        <div className={cx('h-2 w-full rounded-full bg-slate-100 overflow-hidden', className)}>
            <div className={cx('h-full rounded-full transition-all', pct >= 100 ? 'bg-emerald-500' : 'bg-primary-600')} style={{ width: `${pct}%` }} />
        </div>
    );
}
