import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentApplications } from '../services/applicationService';
import { getAllInternships } from '../services/internshipService';
import { useAuth } from '../context/AuthContext';
import {
    Briefcase,
    MapPin,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Search,
    Loader2,
    Grid,
    List as ListIcon,
    ArrowRight
} from 'lucide-react';

function BrowseInternshipsPage() {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [appliedInternshipIds, setAppliedInternshipIds] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            try {
                const listings = await getAllInternships();
                setInternships(listings || []);

                if (user && user.role === 'STUDENT' && user.studentNumber) {
                    try {
                        const myApps = await getStudentApplications(user.studentNumber);
                        const appliedIds = new Set(
                            myApps.map((app) => app.internship?.internshipId || app.internship?.id)
                        );
                        setAppliedInternshipIds(appliedIds);
                    } catch (appErr) {
                        console.warn('Could not pre-load student applications:', appErr);
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load internships. Ensure Spring Boot is running.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    const filteredInternships = internships.filter((internship) => {
        const title = internship.title?.toLowerCase() || '';
        const location = internship.location?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return title.includes(search) || location.includes(search);
    });

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-app-bg p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Page Header */}
                <div className="border-b border-ui-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/20 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-semibold mb-2">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Verified Opportunities</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-text-main font-heading">
                            Available Internships
                        </h1>
                        <p className="mt-1 text-xs text-text-muted">
                            Explore verified industry internship listings and apply with your CPUT student profile.
                        </p>
                    </div>
                </div>

                {/* Search & Layout Controls */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search by title or location (e.g. Cape Town, Java)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-card-bg border border-ui-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:border-brand-accent shadow-xs"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer transition-all ${
                                viewMode === 'grid'
                                    ? 'bg-brand-primary text-white shadow-md'
                                    : 'border border-ui-border bg-card-bg text-text-muted hover:text-text-main'
                            }`}
                        >
                            <Grid className="w-3.5 h-3.5" />
                            <span>Grid</span>
                        </button>

                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer transition-all ${
                                viewMode === 'list'
                                    ? 'bg-brand-primary text-white shadow-md'
                                    : 'border border-ui-border bg-card-bg text-text-muted hover:text-text-main'
                            }`}
                        >
                            <ListIcon className="w-3.5 h-3.5" />
                            <span>List</span>
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16 space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-accent" />
                        <p className="text-xs text-text-muted">Loading available internships...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-900 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredInternships.length === 0 && (
                    <div className="rounded-2xl border border-ui-border bg-card-bg p-12 text-center space-y-2 shadow-xs">
                        <Briefcase className="w-8 h-8 text-text-muted mx-auto" />
                        <h3 className="font-heading font-bold text-text-main text-sm">No Internships Found</h3>
                        <p className="text-xs text-text-muted max-w-sm mx-auto">
                            No listings match your search criteria. Check back soon for new employer postings.
                        </p>
                    </div>
                )}

                {/* Internship Cards / List */}
                {!loading && !error && filteredInternships.length > 0 && (
                    <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'}>
                        {filteredInternships.map((internship) => {
                            const currentId = internship.internshipId || internship.id;
                            const isExpired = internship.deadline && new Date(internship.deadline) < new Date();
                            const hasApplied = appliedInternshipIds.has(currentId);

                            return (
                                <div
                                    key={currentId}
                                    onClick={() => navigate(`/internships/${currentId}`)}
                                    className="rounded-3xl border border-ui-border bg-card-bg p-6 shadow-xs hover:shadow-md hover:border-brand-accent/40 transition-all flex flex-col justify-between cursor-pointer group"
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <h2 className="text-lg font-bold text-text-main font-heading leading-tight group-hover:text-brand-accent transition-colors">
                                                {internship.title}
                                            </h2>
                                            {isExpired && (
                                                <span className="font-mono text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                                                    CLOSED
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-text-muted text-xs leading-relaxed line-clamp-3">
                                            {internship.description}
                                        </p>

                                        <div className="space-y-1.5 pt-2 border-t border-ui-border/60 text-xs">
                                            <div className="flex items-center space-x-2 text-text-muted">
                                                <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                                                <span>{internship.location}</span>
                                            </div>

                                            <div className="flex items-center space-x-2 text-text-muted">
                                                <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                                <span>
                                                    Deadline: {internship.deadline
                                                    ? new Date(internship.deadline).toLocaleDateString()
                                                    : 'Open until filled'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 pt-4 border-t border-ui-border flex justify-between items-center">
                                        <span className="text-[11px] font-mono text-text-muted">
                                            ID: {currentId}
                                        </span>

                                        <div className="flex items-center space-x-2">
                                            {hasApplied && (
                                                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                    <span>Applied</span>
                                                </span>
                                            )}

                                            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-accent group-hover:translate-x-0.5 transition-transform">
                                                <span>View Details</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}

export default BrowseInternshipsPage;