import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { applyForInternship } from '../services/applicationService';

export default function ApplyButton({
                                        internshipId,
                                        studentNumber,
                                        initiallyApplied = false,
                                        onApplied,
                                    }) {
    const [status, setStatus] = useState(initiallyApplied ? 'applied' : 'idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleApply = async () => {
        if (status === 'loading' || status === 'applied') return;

        if (!studentNumber) {
            setStatus('error');
            setErrorMessage('Please sign in with your student account.');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            // Uses flat parameters matching Spring Boot ApplicationRequest record
            const application = await applyForInternship(studentNumber, internshipId);
            setStatus('applied');
            if (onApplied) onApplied(application);
        } catch (err) {
            setStatus('error');
            setErrorMessage(typeof err === 'string' ? err : 'Could not submit your application.');
        }
    };

    if (status === 'applied') {
        return (
            <button
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 cursor-default"
            >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Applied</span>
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-1.5">
            <button
                type="button"
                onClick={handleApply}
                disabled={status === 'loading'}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-primary-hover hover:scale-[1.02] cursor-pointer disabled:opacity-70"
            >
                {status === 'loading' ? (
                    <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Applying...</span>
                    </>
                ) : (
                    <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Apply Now</span>
                    </>
                )}
            </button>

            {status === 'error' && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errorMessage}</span>
                </p>
            )}
        </div>
    );
}