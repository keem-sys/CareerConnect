import { Compass } from 'lucide-react';
import { Button, PageContainer } from '../components/ui';

export default function NotFoundPage() {
    return (
        <PageContainer className="flex flex-col items-center justify-center text-center py-24">
            <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-5">
                <Compass className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-primary-700">Error 404</p>
            <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
            <p className="mt-3 text-text-muted max-w-md">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/">Go to home</Button>
                <Button to="/internships" variant="secondary">Browse internships</Button>
            </div>
        </PageContainer>
    );
}
