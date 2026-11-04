import { Search, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button, Input, Modal } from '../ui';

export function TableToolbar({ query, onQuery, placeholder, shown, total, noun, children }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-ui-border">
            <div className="w-full sm:max-w-sm">
                <Input icon={Search} placeholder={placeholder} value={query} onChange={(e) => onQuery(e.target.value)} aria-label="Search" />
            </div>
            {children}
            <p className="text-sm text-text-muted sm:ml-auto">{shown} of {total} {noun}</p>
        </div>
    );
}

export function RowActions({ onView, onEdit, onDelete }) {
    return (
        <div className="flex justify-end gap-1">
            {onView && <Button variant="ghost" size="sm" icon={Eye} aria-label="View details" title="View" onClick={onView} />}
            {onEdit && <Button variant="ghost" size="sm" icon={Pencil} aria-label="Edit" title="Edit" onClick={onEdit} />}
            {onDelete && <Button variant="ghost" size="sm" icon={Trash2} aria-label="Delete" title="Delete" className="hover:!text-rose-600" onClick={onDelete} />}
        </div>
    );
}

export function FormModal({ open, onClose, title, description, formId, onSubmit, submitLabel, busy, children }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            description={description}
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form={formId} loading={busy}>{submitLabel}</Button></>}
        >
            <form id={formId} onSubmit={onSubmit} className="space-y-4">{children}</form>
        </Modal>
    );
}
