/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext({ toast: () => {} });

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };
const TONES = {
    success: 'text-emerald-600',
    error: 'text-rose-600',
    info: 'text-primary-600',
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

    const toast = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).slice(2);
        setToasts((list) => [...list, { id, message, type }]);
        setTimeout(() => dismiss(id), 4000);
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]">
                {toasts.map((t) => {
                    const Icon = ICONS[t.type] ?? Info;
                    return (
                        <div key={t.id} className="animate-fade-in flex items-start gap-3 bg-white border border-ui-border rounded-lg shadow-(--shadow-pop) px-4 py-3">
                            <Icon className={`w-5 h-5 shrink-0 ${TONES[t.type]}`} />
                            <p className="text-sm flex-1">{t.message}</p>
                            <button onClick={() => dismiss(t.id)} className="text-text-subtle hover:text-text-main cursor-pointer" aria-label="Dismiss">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
