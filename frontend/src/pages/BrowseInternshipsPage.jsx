import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Briefcase, MapPin } from 'lucide-react';
import {
    Alert, Button, Card, EmptyState, Field, Input, PageContainer, PageHeader, Select, cx,
} from '../components/ui';
import InternshipCard, { InternshipCardSkeleton } from '../components/internships/InternshipCard';
import { searchInternships } from '../services/internshipService';
import { FIELDS_OF_STUDY, WORK_MODE_LABELS, errorMessage } from '../lib/format';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest first' },
    { value: 'deadline', label: 'Closing soonest' },
    { value: 'stipend', label: 'Highest stipend' },
    { value: 'title', label: 'Title (A-Z)' },
];

const FILTER_KEYS = ['q', 'location', 'workMode', 'field', 'paidOnly', 'closed'];

export default function BrowseInternshipsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlQ = searchParams.get('q') ?? '';
    const urlLocation = searchParams.get('location') ?? '';
    const workMode = searchParams.get('workMode') ?? '';
    const field = searchParams.get('field') ?? '';
    const paidOnly = searchParams.get('paidOnly') === 'true';
    const showClosed = searchParams.get('closed') === 'true';
    const sort = searchParams.get('sort') || 'newest';

    // Text inputs are local so typing feels instant; they are pushed to the URL after a short debounce.
    const [keyword, setKeyword] = useState(urlQ);
    const [location, setLocation] = useState(urlLocation);
    const [syncedQ, setSyncedQ] = useState(urlQ);
    const [syncedLocation, setSyncedLocation] = useState(urlLocation);
    if (urlQ !== syncedQ) {
        setSyncedQ(urlQ);
        setKeyword(urlQ);
    }
    if (urlLocation !== syncedLocation) {
        setSyncedLocation(urlLocation);
        setLocation(urlLocation);
    }

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [reloadToken, setReloadToken] = useState(0);
    const [result, setResult] = useState({ key: null, items: [], error: '' });

    const updateParams = (changes) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(changes).forEach(([k, v]) => {
                if (v === '' || v === null || v === undefined || v === false) next.delete(k);
                else next.set(k, String(v));
            });
            return next;
        }, { replace: true });
    };

    useEffect(() => {
        if (keyword === urlQ && location === urlLocation) return undefined;
        const t = setTimeout(() => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (keyword) next.set('q', keyword); else next.delete('q');
                if (location) next.set('location', location); else next.delete('location');
                return next;
            }, { replace: true });
        }, 300);
        return () => clearTimeout(t);
    }, [keyword, location, urlQ, urlLocation, setSearchParams]);

    const query = useMemo(() => ({
        q: urlQ.trim(),
        location: urlLocation.trim(),
        workMode,
        field,
        paidOnly,
        openOnly: !showClosed,
        sort,
    }), [urlQ, urlLocation, workMode, field, paidOnly, showClosed, sort]);
    const queryKey = `${JSON.stringify(query)}#${reloadToken}`;

    useEffect(() => {
        let cancelled = false;
        searchInternships(query)
            .then((data) => { if (!cancelled) setResult({ key: queryKey, items: Array.isArray(data) ? data : [], error: '' }); })
            .catch((err) => { if (!cancelled) setResult({ key: queryKey, items: [], error: errorMessage(err, 'Could not load internships.') }); });
        return () => { cancelled = true; };
    }, [query, queryKey]);

    const loading = result.key !== queryKey;
    const activeFilterCount = [urlLocation, workMode, field, paidOnly, showClosed].filter(Boolean).length;
    const hasAnyFilter = FILTER_KEYS.some((k) => searchParams.get(k));

    const clearFilters = () => {
        setKeyword('');
        setLocation('');
        setSearchParams((prev) => {
            const next = new URLSearchParams();
            if (prev.get('sort')) next.set('sort', prev.get('sort'));
            return next;
        }, { replace: true });
    };

    return (
        <PageContainer>
            <PageHeader title="Browse internships" subtitle="Find an internship that matches your field, skills and location." />

            <form onSubmit={(e) => e.preventDefault()} className="mb-6" role="search">
                <label htmlFor="browse-q" className="sr-only">Search internships</label>
                <div className="relative">
                    <Input
                        id="browse-q"
                        icon={Search}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search by job title, skill or company"
                        className="h-12 text-base pr-10"
                    />
                    {keyword && (
                        <button
                            type="button"
                            onClick={() => setKeyword('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-subtle hover:text-text-main hover:bg-slate-100 cursor-pointer"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
                {/* Filters */}
                <aside>
                    <Button
                        variant="secondary"
                        icon={SlidersHorizontal}
                        className="w-full lg:hidden mb-3"
                        onClick={() => setFiltersOpen((o) => !o)}
                        aria-expanded={filtersOpen}
                    >
                        {filtersOpen ? 'Hide filters' : 'Show filters'}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                    </Button>

                    <Card className={cx('space-y-5 lg:block lg:sticky lg:top-20', filtersOpen ? 'block' : 'hidden')}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold">Filters</h2>
                            {hasAnyFilter && (
                                <button type="button" onClick={clearFilters} className="text-sm font-medium text-primary-700 hover:text-primary-800 cursor-pointer">
                                    Clear all
                                </button>
                            )}
                        </div>

                        <Field label="Location" htmlFor="filter-location">
                            <Input
                                id="filter-location"
                                icon={MapPin}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Cape Town"
                            />
                        </Field>

                        <fieldset>
                            <legend className="block text-sm font-medium text-text-main mb-2">Work mode</legend>
                            <div className="space-y-2">
                                {[['', 'Any'], ...Object.entries(WORK_MODE_LABELS)].map(([value, label]) => (
                                    <label key={value || 'any'} className="flex items-center gap-2.5 text-sm text-text-main cursor-pointer">
                                        <input
                                            type="radio"
                                            name="workMode"
                                            value={value}
                                            checked={workMode === value}
                                            onChange={() => updateParams({ workMode: value })}
                                            className="w-4 h-4 accent-primary-600"
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <Field label="Field of study" htmlFor="filter-field">
                            <Select id="filter-field" value={field} onChange={(e) => updateParams({ field: e.target.value })}>
                                <option value="">All fields</option>
                                {FIELDS_OF_STUDY.map((f) => <option key={f} value={f}>{f}</option>)}
                            </Select>
                        </Field>

                        <div className="space-y-3 pt-1">
                            <label className="flex items-center gap-2.5 text-sm text-text-main cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={paidOnly}
                                    onChange={(e) => updateParams({ paidOnly: e.target.checked })}
                                    className="w-4 h-4 rounded accent-primary-600"
                                />
                                Paid internships only
                            </label>
                            <label className="flex items-center gap-2.5 text-sm text-text-main cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showClosed}
                                    onChange={(e) => updateParams({ closed: e.target.checked })}
                                    className="w-4 h-4 rounded accent-primary-600"
                                />
                                Include closed internships
                            </label>
                        </div>
                    </Card>
                </aside>

                {/* Results */}
                <section aria-live="polite">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <p className="text-sm text-text-muted">
                            {loading ? 'Searching…' : result.error ? '' : (
                                <>
                                    <span className="font-semibold text-text-main">{result.items.length}</span>{' '}
                                    {result.items.length === 1 ? 'internship' : 'internships'} found
                                </>
                            )}
                        </p>
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort" className="text-sm text-text-muted whitespace-nowrap">Sort by</label>
                            <Select id="sort" value={sort} onChange={(e) => updateParams({ sort: e.target.value === 'newest' ? '' : e.target.value })} className="sm:w-48">
                                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </Select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => <InternshipCardSkeleton key={i} />)}
                        </div>
                    ) : result.error ? (
                        <Alert title="We couldn't load internships">
                            <p className="mt-1">{result.error}</p>
                            <Button size="sm" variant="secondary" className="mt-3" onClick={() => setReloadToken((n) => n + 1)}>Try again</Button>
                        </Alert>
                    ) : result.items.length === 0 ? (
                        <Card padding={false}>
                            <EmptyState
                                icon={Briefcase}
                                title="No internships match your search"
                                description="Try a different keyword, widen your location or remove some filters."
                                action={hasAnyFilter ? <Button variant="secondary" onClick={clearFilters}>Clear filters</Button> : null}
                            />
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {result.items.map((i) => <InternshipCard key={i.internshipId} internship={i} />)}
                        </div>
                    )}
                </section>
            </div>
        </PageContainer>
    );
}
