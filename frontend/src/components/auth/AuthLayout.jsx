import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Input } from '../ui';

const DEFAULT_BENEFITS = [
    'Discover verified internships from leading South African employers',
    'Apply in minutes and track every application in one place',
    'Built for CPUT students, employers and the WIL office',
];

export function AuthLayout({ title, text, benefits = DEFAULT_BENEFITS, children }) {
    return (
        <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 bg-app-bg">
            <div className="relative hidden overflow-hidden bg-linear-to-br from-primary-900 via-primary-800 to-primary-700 p-8 text-white lg:flex lg:flex-col lg:justify-between lg:gap-16 xl:p-12">
                <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-120 rounded-full border border-white/10" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-64 -left-40 size-144 rounded-full border border-white/10" />
                <Link to="/" className="relative inline-flex w-fit items-center gap-3 rounded-lg text-lg font-semibold focus-visible:outline-white">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                        <GraduationCap className="size-5" />
                    </span>
                    <span>Career<span className="text-primary-200">Connect</span></span>
                </Link>
                <div className="relative mx-auto w-full max-w-md">
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-200">
                        Your next chapter starts here
                    </p>
                    <h2 className="text-3xl font-semibold leading-[1.15] text-white xl:text-4xl">{title}</h2>
                    <p className="mt-5 text-base leading-relaxed text-primary-100">{text}</p>
                    <div className="mt-9 border-t border-white/15 pt-7">
                        <ul className="space-y-5">
                            {benefits.map((b) => (
                                <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-primary-50">
                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary-200" />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="relative border-t border-white/15 pt-5 text-xs leading-relaxed text-primary-200">
                    <p className="font-medium text-primary-100">Built for the CPUT community</p>
                    <p className="mt-1">Cape Peninsula University of Technology &middot; Work Integrated Learning</p>
                </div>
            </div>
            <div className="flex items-center justify-center p-4 sm:p-8">{children}</div>
        </div>
    );
}

export function PasswordInput(props) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <Input icon={Lock} type={show ? 'text' : 'password'} className="pr-10" {...props} />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-text-subtle hover:text-text-main cursor-pointer"
                aria-label={show ? 'Hide password' : 'Show password'}
            >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    );
}
