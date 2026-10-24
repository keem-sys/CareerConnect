import { useState } from 'react';
import {
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

import { applyToInternship } from '../services/applicationService';

export default function ApplyButton({
                                        internshipId,
                                        studentNumber,
                                        initiallyApplied = false,
                                        onApplied,
                                    }) {
    const [status, setStatus] = useState(
        initiallyApplied ? 'applied' : 'idle'
    );

    const [errorMessage, setErrorMessage] = useState('');

    const handleApply = async () => {
        if (status === 'loading' || status === 'applied') {
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const application = await applyToInternship({
                studentNumber,
                internshipId,
            });

            setStatus('applied');

            if (onApplied) {
                onApplied(application);
            }
        } catch (err) {
            setStatus('error');

            const backendMessage =
                typeof err?.response?.data === 'string'
                    ? err.response.data
                    : err?.response?.data?.message;

            setErrorMessage(
                backendMessage ||
                'Could not submit your application. Please try again.'
            );
        }
    };

    if (status === 'applied') {
        return (
            <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 font-sans text-sm font-medium text-brand-mint cursor-default"
            >
                <CheckCircle2 className="h-4 w-4" />
                Applied
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-1.5">
            <button
                type="button"
                onClick={handleApply}
                disabled={status === 'loading'}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 font-sans text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
                {status === 'loading' ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Applying...
                    </>
                ) : (
                    <>
                        <Send className="h-4 w-4" />
                        Apply Now
                    </>
                )}
            </button>

            {status === 'error' && (
                <p className="flex items-center gap-1.5 text-xs text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errorMessage}
                </p>
            )}
        </div>
    );
}