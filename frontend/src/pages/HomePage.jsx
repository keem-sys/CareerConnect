import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, MapPin, Briefcase, Building2, GraduationCap, Award, ArrowRight,
    UserPlus, FileText, CheckCircle2, ClipboardList, Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import StudentDashboardPage from './dashboards/StudentDashboardPage';
import CompanyDashboardPage from './dashboards/CompanyDashboardPage';
import AdminDashboardPage from './dashboards/AdminDashboardPage';
import { Alert, Button, EmptyState, Input, Skeleton } from '../components/ui';
import InternshipCard, { InternshipCardSkeleton } from '../components/internships/InternshipCard';
import { getPublicStats } from '../services/statsService';
import { searchInternships } from '../services/internshipService';
import { errorMessage } from '../lib/format';

export default function HomePage() {
    const { user } = useAuth();

    if (user?.role === 'STUDENT') return <StudentDashboardPage />;
    if (user?.role === 'COMPANY') return <CompanyDashboardPage />;
    if (user?.role === 'ADMIN') return <AdminDashboardPage />;
    return <GuestLandingView />;
}

const STUDENT_STEPS = [
    { icon: UserPlus, title: 'Create your profile', text: 'Sign up with your student number and add your skills, bio and CV link.' },
    { icon: Search, title: 'Find the right role', text: 'Filter internships by field, location, work mode and stipend.' },
    { icon: FileText, title: 'Apply and track', text: 'Apply with a cover letter and follow every status update in one place.' },
];

const EMPLOYER_STEPS = [
    { icon: Building2, title: 'Register your company', text: 'Create an employer account in a couple of minutes.' },
    { icon: ClipboardList, title: 'Post internships', text: 'Publish roles with skills, stipend, duration and a closing date.' },
    { icon: CheckCircle2, title: 'Review and hire', text: 'Screen applicants, shortlist the best and send offers.' },
];

function GuestLandingView() {
    const navigate = useNavigate();
    const [q, setQ] = useState('');
    const [location, setLocation] = useState('');
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [featured, setFeatured] = useState([]);
    const [featuredLoading, setFeaturedLoading] = useState(true);
    const [featuredError, setFeaturedError] = useState('');

    useEffect(() => {
        getPublicStats()
            .then(setStats)
            .catch(() => setStats(null))
            .finally(() => setStatsLoading(false));
        searchInternships({ openOnly: true, sort: 'newest', limit: 6 })
            .then((data) => setFeatured(Array.isArray(data) ? data : []))
            .catch((err) => setFeaturedError(errorMessage(err, 'Could not load internships.')))
            .finally(() => setFeaturedLoading(false));
    }, []);

    const onSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (q.trim()) params.set('q', q.trim());
        if (location.trim()) params.set('location', location.trim());
        const qs = params.toString();
        navigate(qs ? `/internships?${qs}` : '/internships');
    };

    const statItems = [
        { label: 'Open internships', value: stats?.openInternships, icon: Briefcase },
        { label: 'Hiring companies', value: stats?.companies, icon: Building2 },
        { label: 'Registered students', value: stats?.students, icon: GraduationCap },
        { label: 'Successful placements', value: stats?.placements, icon: Award },
    ];

    return (
        <div>
            {/* Hero */}
            <section className="bg-white border-b border-ui-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold text-primary-700">Internships for CPUT students</p>
                        <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-text-main leading-tight">
                            Start your career with the right internship
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
                            CareerConnect brings students and employers together. Discover verified opportunities,
                            apply in minutes and track every application from one dashboard.
                        </p>
                    </div>

                    <form onSubmit={onSearch} className="mt-8 max-w-4xl bg-white border border-ui-border rounded-xl p-2 shadow-(--shadow-card) flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                            <label htmlFor="hero-q" className="sr-only">Keyword</label>
                            <Input id="hero-q" icon={Search} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title, skill or company" className="border-transparent" />
                        </div>
                        <div className="sm:w-64">
                            <label htmlFor="hero-location" className="sr-only">Location</label>
                            <Input id="hero-location" icon={MapPin} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or remote" className="border-transparent" />
                        </div>
                        <Button type="submit" icon={Search}>Search internships</Button>
                    </form>

                    <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {statItems.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-text-main">
                                        {statsLoading ? <Skeleton className="h-6 w-12" /> : (value ?? 'â€”')}
                                    </div>
                                    <p className="text-sm text-text-muted">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured internships */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Featured internships</h2>
                        <p className="text-text-muted mt-1">The latest opportunities currently accepting applications.</p>
                    </div>
                    <Link to="/internships" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800">
                        Browse all internships <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {featuredError ? (
                    <Alert title="Internships are unavailable right now">{featuredError}</Alert>
                ) : featuredLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <InternshipCardSkeleton key={i} />)}
                    </div>
                ) : featured.length === 0 ? (
                    <div className="bg-card-bg border border-ui-border rounded-xl">
                        <EmptyState icon={Briefcase} title="No open internships yet" description="New opportunities are posted regularly. Check back soon." />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featured.map((i) => <InternshipCard key={i.internshipId} internship={i} />)}
                    </div>
                )}
            </section>

            {/* How it works */}
            <section className="bg-white border-y border-ui-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold">How it works</h2>
                        <p className="text-text-muted mt-1">A simple process for students and employers.</p>
                    </div>
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <StepList heading="For students" icon={GraduationCap} steps={STUDENT_STEPS} />
                        <StepList heading="For employers" icon={Users} steps={EMPLOYER_STEPS} />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="bg-primary-700 rounded-xl px-6 py-10 sm:px-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
                        <p className="mt-2 text-primary-100 max-w-xl">
                            Create a free account as a student to apply, or as an employer to start posting internships.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <Button to="/signup" size="lg" variant="secondary">Create an account</Button>
                        <Link to="/login" className="inline-flex items-center justify-center h-12 px-6 rounded-lg text-base font-semibold text-white border border-primary-400 hover:bg-primary-600 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function StepList({ heading, icon: HeadingIcon, steps }) {
    return (
        <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
                <HeadingIcon className="w-5 h-5 text-primary-600" />
                {heading}
            </h3>
            <ol className="mt-5 space-y-5">
                {steps.map(({ icon: Icon, title, text }, idx) => (
                    <li key={title} className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg border border-ui-border bg-app-bg text-primary-600 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-text-main">
                                <span className="text-text-subtle mr-1.5">{idx + 1}.</span>{title}
                            </p>
                            <p className="text-sm text-text-muted mt-0.5">{text}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
