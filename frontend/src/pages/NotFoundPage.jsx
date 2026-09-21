import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-card-bg border border-ui-border rounded-3xl p-8 text-center shadow-xl space-y-6">

                <div className="w-16 h-16 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
          <span className="font-mono text-xs font-semibold text-brand-accent bg-brand-primary/10 border border-brand-accent/20 px-2.5 py-0.5 rounded-full">
            ERROR 404
          </span>
                    <h1 className="font-heading text-2xl font-extrabold text-text-main pt-1">
                        Page Not Found
                    </h1>
                    <p className="text-text-muted text-xs leading-relaxed">
                        The link you followed does not exist, was removed, or had its name changed.
                    </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-app-bg hover:bg-card-hover border border-ui-border text-text-main text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Go Back</span>
                    </button>

                    <Link
                        to="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl shadow-md shadow-brand-primary/20 transition-all cursor-pointer"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Home Page</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}