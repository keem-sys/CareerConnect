import React, { useState, useEffect } from 'react';
import { getAllCompanies, getCompaniesByIndustry } from '../services/companyService';
import { Building2, Search, Briefcase, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function CompanyDirectoryPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCompanies = async () => {
        try {
            const data = await getAllCompanies();
            setCompanies(data);
        } catch (err) {
            setError('Failed to load partner companies. Ensure Spring Boot is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter((comp) => {
        const name = comp.name?.toLowerCase() || '';
        const industry = comp.industry?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || industry.includes(search);
    });

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-app-bg p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <div className="border-b border-ui-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/20 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-semibold mb-2">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Industry Partners</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-text-main font-heading">
                            Verified Hiring Companies
                        </h1>
                        <p className="mt-1 text-xs text-text-muted">
                            Explore registered technology partners offering Work-Integrated Learning (WIL) opportunities for CPUT students.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search by company or industry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-card-bg border border-ui-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:border-brand-accent shadow-sm"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16 space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-accent" />
                        <p className="text-xs text-text-muted">Loading partner companies...</p>
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
                {!loading && !error && filteredCompanies.length === 0 && (
                    <div className="rounded-2xl border border-ui-border bg-card-bg p-12 text-center space-y-2 shadow-sm">
                        <Building2 className="w-8 h-8 text-text-muted mx-auto opacity-50" />
                        <h3 className="font-heading font-bold text-text-main text-sm">No Companies Found</h3>
                        <p className="text-xs text-text-muted max-w-sm mx-auto">
                            No registered corporate partners match your search criteria.
                        </p>
                    </div>
                )}

                {/* Company Cards Grid */}
                {!loading && !error && filteredCompanies.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCompanies.map((company) => (
                            <div
                                key={company.companyId}
                                className="rounded-2xl border border-ui-border bg-card-bg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-bold">
                                            {company.name ? company.name.substring(0, 2).toUpperCase() : 'CO'}
                                        </div>
                                        <span className="font-mono text-[10px] text-text-muted bg-app-bg border border-ui-border px-2 py-0.5 rounded-md">
                      ID: {company.companyId}
                    </span>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-text-main font-heading">
                                            {company.name}
                                        </h2>
                                        <span className="inline-block mt-1 font-mono text-[11px] font-semibold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-2 py-0.5 rounded">
                      {company.industry}
                    </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-ui-border text-xs flex items-center space-x-2 text-text-muted">
                                    <Mail className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                                    <span className="truncate">{company.contactEmail}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}