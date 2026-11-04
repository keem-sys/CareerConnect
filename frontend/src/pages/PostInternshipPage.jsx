import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createInternship } from '../services/internshipService';
import { useToast } from '../components/ui/Toast';
import { Alert, Button, PageContainer, PageHeader } from '../components/ui';
import InternshipForm from '../components/company/InternshipForm';
import InternshipPreview from '../components/company/InternshipPreview';
import { emptyInternshipForm, generateInternshipId, toPayload, validateInternship } from '../components/company/internshipFormUtils';
import { errorMessage } from '../lib/format';

export default function PostInternshipPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const companyId = user?.companyId ?? user?.id;

    const [values, setValues] = useState(emptyInternshipForm);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (next) => {
        setValues(next);
        if (submitted) setErrors(validateInternship(next));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setServerError('');
        const found = validateInternship(values);
        setErrors(found);
        if (Object.keys(found).length > 0) {
            toast('Please fix the highlighted fields.', 'error');
            return;
        }

        setSaving(true);
        try {
            await createInternship({ internshipId: generateInternshipId(), companyId, ...toPayload(values) });
            toast('Internship published', 'success');
            navigate('/company/postings');
        } catch (err) {
            setServerError(errorMessage(err, 'Could not publish the internship. Please try again.'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <PageContainer>
            <PageHeader
                title="Post an internship"
                subtitle="Create a listing that students can discover and apply to."
                breadcrumb="Employer / Postings"
            />

            <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-5">
                    {serverError && <Alert title="Publishing failed">{serverError}</Alert>}
                    <InternshipForm values={values} errors={errors} onChange={handleChange} />
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={() => navigate('/company/postings')}>Cancel</Button>
                        <Button type="submit" loading={saving}>Publish internship</Button>
                    </div>
                </div>

                <aside className="lg:sticky lg:top-24">
                    <InternshipPreview values={values} companyName={user?.name || 'Your company'} />
                    <p className="text-xs text-text-muted mt-3 px-1">This is how students will see your listing in search results and on the details page.</p>
                </aside>
            </form>
        </PageContainer>
    );
}
