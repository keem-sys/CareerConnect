import { useEffect, useState } from 'react';
import internshipService from '../services/internshipService';

function BrowseInternshipsPage() {
    const [internships, setInternships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const data = await internshipService.getAllInternships();
                setInternships(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load internships.');
            } finally {
                setLoading(false);
            }
        };

        fetchInternships();
    }, []);

    const filteredInternships = internships.filter((internship) => {
        const title = internship.title?.toLowerCase() || '';
        const location = internship.location?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return (
            title.includes(search) ||
            location.includes(search)
        );
    });

    return (
        <div className="min-h-screen bg-card-bg p-8">
            <div className="mx-auto max-w-7xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-main">
                        Available Internships
                    </h1>

                    <p className="mt-2 text-text-main">
                        Browse available internship opportunities.
                    </p>
                </div>

                {/* Search and View Controls */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <input
                        type="text"
                        placeholder="Search by title or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-ui-border bg-white p-3 md:max-w-md"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`rounded-lg px-4 py-2 ${
                                viewMode === 'grid'
                                    ? 'bg-brand-primary text-white'
                                    : 'border border-ui-border bg-white text-text-main'
                            }`}
                        >
                            Grid
                        </button>

                        <button
                            onClick={() => setViewMode('list')}
                            className={`rounded-lg px-4 py-2 ${
                                viewMode === 'list'
                                    ? 'bg-brand-primary text-white'
                                    : 'border border-ui-border bg-white text-text-main'
                            }`}
                        >
                            List
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <p className="text-text-main">
                        Loading internships...
                    </p>
                )}

                {/* Error */}
                {error && (
                    <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && filteredInternships.length === 0 && (
                    <div className="rounded-lg border border-ui-border bg-white p-8 text-center">
                        <p className="text-text-main">
                            No internships found.
                        </p>
                    </div>
                )}

                {/* Internship Listings */}
                {!loading && !error && filteredInternships.length > 0 && (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                                : 'flex flex-col gap-4'
                        }
                    >
                        {filteredInternships.map((internship) => (
                            <div
                                key={internship.internshipId || internship.id}
                                className="rounded-xl border border-ui-border bg-white p-6 shadow-sm"
                            >
                                <h2 className="mb-2 text-xl font-bold text-text-main">
                                    {internship.title}
                                </h2>

                                <p className="mb-3 text-text-main">
                                    {internship.description}
                                </p>

                                <div className="mb-2">
                                    <span className="font-semibold text-text-main">
                                        Location:
                                    </span>{' '}
                                    {internship.location}
                                </div>

                                <div>
                                    <span className="font-semibold text-text-main">
                                        Deadline:
                                    </span>{' '}
                                    {internship.deadline
                                        ? new Date(internship.deadline).toLocaleString()
                                        : 'Not specified'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default BrowseInternshipsPage;
