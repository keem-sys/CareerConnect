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
            <div className="hidden lg:flex flex-col justify-between bg-primary-700 text-white p-10 xl:p-14">
                <Link to="/" className="inline-flex items-center gap-2 font-semibold text-lg">
                    <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center"><GraduationCap className="w-5 h-5" /></span>
                    CareerConnect
                </Link>
                <div className="max-w-md">
                    <h2 className="text-3xl font-bold leading-tight">{title}</h2>
                    <p className="mt-3 text-primary-100">{text}</p>
                    <ul className="mt-8 space-y-4">
                        {benefits.map((b) => (
                            <li key={b} className="flex items-start gap-3 text-primary-50">
                                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-primary-200" />
                                <span>{b}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="text-sm text-primary-200">Cape Peninsula University of Technology - Work Integrated Learning</p>
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
