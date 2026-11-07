import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Briefcase, ChevronRight } from 'lucide-react';
import {
    Alert, Button, Card, CompanyLogo, EmptyState, Input, PageContainer, PageHeader, Select, Skeleton,
} from '../components/ui';
import { getAllCompanies } from '../services/companyService';
import { searchInternships } from '../services/internshipService';
import { errorMessage } from '../lib/format';

export default function CompanyDirectoryPage() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [openCounts, setOpenCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadToken, setReloadToken] = useState(0);
    const [search, setSearch] = useState('');
    const [industry, setIndustry] = useState('');

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            getAllCompanies(),
            searchInternships({ openOnly: true }).catch(() => []),
        ])
            .then(([companyData, internships]) => {
                if (cancelled) return;
                const counts = {};
                (internships ?? []).forEach((i) => {
                    counts[i.companyId] = (counts[i.companyId] ?? 0) + 1;
                });
                setCompanies(Array.isArray(companyData) ? companyData : []);
                setOpenCounts(counts);
                setError('');
            })
            .catch((err) => { if (!cancelled) setError(errorMessage(err, 'Could not load companies.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [reloadToken]);

    const industries = useMemo(
        () => [...new Set(companies.map((c) => c.industry).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
        [companies],
    );

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return companies
            .filter((c) => !industry || c.industry === industry)
            .filter((c) => !term || c.name?.toLowerCase().includes(term) || c.industry?.toLowerCase().includes(term))
            .sort((a, b) => (openCounts[b.companyId] ?? 0) - (openCounts[a.companyId] ?? 0) || (a.name ?? '').localeCompare(b.name ?? ''));
    }, [companies, search, industry, openCounts]);

    const retry = () => {
        setLoading(true);
        setError('');
        setReloadToken((n) => n + 1);
    };

    return (
        <PageContainer>
            <PageHeader title="Companies" subtitle="Explore the employers hiring interns on CareerConnect." />

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <label htmlFor="company-search" className="sr-only">Search companies</label>
                    <Input id="company-search" icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by company name or industry" />
                </div>
                <div className="sm:w-60">
                    <label htmlFor="company-industry" className="sr-only">Industry</label>
                    <Select id="company-industry" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                        <option value="">All industries</option>
                        {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                    </Select>
                </div>
            </div>

            {error ? (
                <Alert title="We couldn't load companies">
                    <p className="mt-1">{error}</p>
                    <Button size="sm" variant="secondary" className="mt-3" onClick={retry}>Try again</Button>
                </Alert>
            ) : loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="flex items-center gap-4">
                            <Skeleton className="w-11 h-11 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3.5 w-1/2" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <Card padding={false}>
                    <EmptyState
                        icon={Building2}
                        title={companies.length === 0 ? 'No companies yet' : 'No companies match your search'}
                        description={companies.length === 0 ? 'Employers will appear here once they register.' : 'Try another name or choose a different industry.'}
                        action={companies.length > 0 ? <Button variant="secondary" onClick={() => { setSearch(''); setIndustry(''); }}>Clear filters</Button> : null}
                    />
                </Card>
            ) : (
                <>
                    <p className="text-sm text-text-muted mb-4">
                        <span className="font-semibold text-text-main">{filtered.length}</span> {filtered.length === 1 ? 'company' : 'companies'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((c) => {
                            const count = openCounts[c.companyId] ?? 0;
                            return (
                                <button
                                    key={c.companyId}
                                    type="button"
                                    onClick={() => navigate(`/internships?q=${encodeURIComponent(c.name ?? '')}`)}
                                    className="group text-left bg-card-bg border border-ui-border rounded-xl p-5 shadow-(--shadow-card) transition hover:border-primary-200 hover:shadow-(--shadow-pop) cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <CompanyLogo name={c.name} />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-text-main truncate group-hover:text-primary-700">{c.name}</p>
                                            <p className="text-sm text-text-muted truncate">{c.industry || 'Industry not specified'}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-text-subtle shrink-0 group-hover:text-primary-600" />
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-ui-border flex items-center gap-1.5 text-sm">
                                        <Briefcase className="w-4 h-4 text-text-subtle" />
                                        {count > 0 ? (
                                            <span className="font-medium text-primary-700">{count} open internship{count === 1 ? '' : 's'}</span>
                                        ) : (
                                            <span className="text-text-muted">No open internships</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </PageContainer>
    );
}
