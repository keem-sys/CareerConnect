import { useState } from 'react';
import internshipService from '../services/internshipService';

function PostInternshipPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        deadline: ''
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setMessageType('');

        if (
            !formData.title ||
            !formData.description ||
            !formData.location ||
            !formData.deadline
        ) {
            setMessage('Please fill in all fields.');
            setMessageType('error');
            return;
        }

        try {
            await internshipService.createInternship({
                title: formData.title,
                description: formData.description,
                location: formData.location,
                deadline: formData.deadline
            });

            setMessage('Internship created successfully!');
            setMessageType('success');

            setFormData({
                title: '',
                description: '',
                location: '',
                deadline: ''
            });
        } catch (error) {
            console.error(error);
            setMessage('Failed to create internship. Please try again.');
            setMessageType('error');
        }
    };

    return (
        <div className="min-h-screen bg-card-bg p-8">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-2 text-3xl font-bold text-text-main">
                    Post an Internship
                </h1>

                <p className="mb-6 text-text-main">
                    Create a new internship opportunity for students.
                </p>

                {message && (
                    <div
                        className={`mb-6 rounded-lg border p-4 ${
                            messageType === 'success'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-red-500 bg-red-50 text-red-700'
                        }`}
                    >
                        {message}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-ui-border bg-white p-6 shadow-sm"
                >
                    <div className="mb-4">
                        <label className="mb-2 block font-medium text-text-main">
                            Internship Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Software Developer Intern"
                            className="w-full rounded-lg border border-ui-border p-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block font-medium text-text-main">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the internship..."
                            rows="5"
                            className="w-full rounded-lg border border-ui-border p-3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block font-medium text-text-main">
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Cape Town"
                            className="w-full rounded-lg border border-ui-border p-3"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block font-medium text-text-main">
                            Application Deadline
                        </label>

                        <input
                            type="datetime-local"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-ui-border p-3"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-brand-primary px-6 py-3 font-semibold text-white hover:opacity-90"
                    >
                        Create Internship
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostInternshipPage;
