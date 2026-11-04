import React, { useState, useEffect } from 'react';
import {
    createStudent,
    getAllStudents,
    deleteStudent,
    updateStudent
} from '../services/studentService';
import {
    UserPlus,
    Users,
    Search,
    Trash2,
    Pencil,
    RefreshCw,
    CheckCircle2,
    Mail,
    X,
    AlertCircle,
    Loader2,
    ShieldCheck
} from 'lucide-react';

export default function AdminStudentPage() {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deletingId, setDeletingId] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [newStudent, setNewStudent] = useState({
        studentNumber: '',
        name: '',
        password: '',
        confirmPassword: ''
    });

    // Edit Student Form Data
    const [editFormData, setEditFormData] = useState({
        studentNumber: '',
        name: '',
        email: ''
    });

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await getAllStudents();
            setStudents(data || []);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load students from Spring Boot backend.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Handle Create Submit
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newStudent.password !== newStudent.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setSubmitting(true);
        const derivedEmail = `${newStudent.studentNumber.trim()}@mycput.ac.za`;

        try {
            const payload = {
                studentNumber: newStudent.studentNumber.trim(),
                name: newStudent.name.trim(),
                email: derivedEmail,
                password: newStudent.password,
                confirmPassword: newStudent.confirmPassword
            };

            const result = await createStudent(payload);
            if (result) {
                setMessage({ type: 'success', text: `Student ${result.studentNumber} registered successfully!` });
                setNewStudent({ studentNumber: '', name: '', password: '', confirmPassword: '' });
                setShowAddModal(false);
                fetchStudents();
            }
        } catch (err) {
            setMessage({ type: 'error', text: typeof err === 'string' ? err : 'Registration failed. Student number may already exist.' });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Edit Click
    const handleEditClick = (student) => {
        setEditingStudent(student);
        setEditFormData({
            studentNumber: student.studentNumber,
            name: student.name,
            email: student.email
        });
    };

    // Handle Update Submit
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const result = await updateStudent(editFormData);
            if (result) {
                setMessage({ type: 'success', text: `Student ${result.studentNumber} updated successfully!` });
                setEditingStudent(null);
                fetchStudents();
            }
        } catch (err) {
            setMessage({ type: 'error', text: typeof err === 'string' ? err : 'Error updating student record.' });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Delete
    const handleDelete = async (studentNumber, name) => {
        if (!window.confirm(`Are you sure you want to permanently delete student account "${name}" (${studentNumber})?`)) {
            return;
        }

        setDeletingId(studentNumber);
        setMessage({ type: '', text: '' });

        try {
            await deleteStudent(studentNumber);
            setMessage({ type: 'success', text: `Student ${studentNumber} was deleted successfully.` });
            setStudents((prev) => prev.filter((s) => s.studentNumber !== studentNumber));
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete student account.' });
        } finally {
            setDeletingId(null);
        }
    };

    // Multi-field instant filter (Searches Student Number, Name, AND Email)
    const filteredStudents = students.filter((std) => {
        const query = searchQuery.toLowerCase();
        const num = (std.studentNumber || '').toLowerCase();
        const name = (std.name || '').toLowerCase();
        const email = (std.email || '').toLowerCase();

        return num.includes(query) || name.includes(query) || email.includes(query);
    });

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Header */}
            <div className="border-b border-ui-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-accent/20 px-3 py-1 rounded-full text-brand-accent text-xs font-mono font-semibold mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>STUDENT ACCOUNTS DIRECTORY</span>
                    </div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-main">
                        Student Directory Management
                    </h1>
                    <p className="text-text-muted text-xs">
                        Audit enrolled CPUT student profiles, manage login credentials, and oversee student records.
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={fetchStudents}
                        title="Refresh Table"
                        className="p-2.5 text-text-muted hover:text-text-main bg-card-bg border border-ui-border rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-accent' : ''}`} />
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-xl shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Register New Student</span>
                    </button>
                </div>
            </div>

            {/* Top Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card-bg border border-ui-border p-4 rounded-2xl shadow-xs flex items-center space-x-4">
                    <div className="p-3 bg-brand-primary/10 text-brand-accent rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[11px] font-semibold text-text-muted uppercase">Registered Students</span>
                        <h4 className="font-heading text-xl font-bold text-text-main mt-0.5">{students.length} Accounts</h4>
                    </div>
                </div>

                <div className="bg-card-bg border border-ui-border p-4 rounded-2xl shadow-xs flex items-center space-x-4">
                    <div className="p-3 bg-emerald-50 text-brand-mint rounded-xl">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[11px] font-semibold text-text-muted uppercase">Domain Authorization</span>
                        <h4 className="font-heading text-xl font-bold text-brand-mint mt-0.5">@mycput.ac.za Verified</h4>
                    </div>
                </div>
            </div>

            {/* Notification Banner */}
            {message.text && (
                <div className={`flex items-center space-x-2 p-4 rounded-xl font-medium text-xs border shadow-xs ${
                    message.type === 'success'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Multi-Field Search Bar */}
            <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student number, name, or email..."
                    className="w-full bg-card-bg border border-ui-border rounded-xl pl-10 pr-4 py-2 text-xs text-text-main placeholder-text-muted/60 focus:outline-none focus:border-brand-accent shadow-xs"
                />
            </div>

            {/* Full-Width Student Table */}
            {loading ? (
                <div className="text-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-accent" />
                    <p className="text-xs text-text-muted">Loading student directory...</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="bg-card-bg border border-ui-border rounded-2xl p-12 text-center space-y-3 shadow-xs">
                    <Users className="w-10 h-10 text-text-muted mx-auto opacity-40" />
                    <h3 className="font-heading font-bold text-text-main text-base">No Students Found</h3>
                    <p className="text-xs text-text-muted max-w-sm mx-auto">
                        {searchQuery ? 'No student accounts match your search query.' : 'No students registered in the database yet.'}
                    </p>
                </div>
            ) : (
                <div className="bg-card-bg border border-ui-border rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-text-main">
                            <thead className="bg-slate-50 text-text-muted font-mono uppercase text-[10px] border-b border-ui-border">
                            <tr>
                                <th className="p-4">Student Number</th>
                                <th className="p-4">Full Student Name</th>
                                <th className="p-4">Official CPUT Email</th>
                                <th className="p-4 text-right">Administrative Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-ui-border">
                            {filteredStudents.map((std) => {
                                const isDeleting = deletingId === std.studentNumber;

                                return (
                                    <tr key={std.studentNumber} className="hover:bg-slate-50/50 transition-colors">

                                        {/* Student Number */}
                                        <td className="p-4 font-mono font-bold text-brand-primary text-sm">
                                            {std.studentNumber}
                                        </td>

                                        {/* Name */}
                                        <td className="p-4 font-medium text-text-main">
                                            {std.name}
                                        </td>

                                        {/* Email */}
                                        <td className="p-4 font-mono text-text-muted">
                                            {std.email}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(std)}
                                                    title="Edit Student Record"
                                                    className="p-1.5 bg-slate-50 hover:bg-amber-50 text-text-muted hover:text-amber-600 border border-ui-border rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(std.studentNumber, std.name)}
                                                    disabled={isDeleting}
                                                    title="Delete Student"
                                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL 1: REGISTER STUDENT MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleCreateSubmit} className="bg-card-bg border border-ui-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-ui-border pb-3">
                            <div className="flex items-center space-x-2 text-brand-primary">
                                <UserPlus className="w-5 h-5 text-brand-accent" />
                                <h3 className="font-heading font-bold text-text-main text-base">Register Student Account</h3>
                            </div>
                            <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-text-muted hover:text-text-main">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-text-muted mb-1">CPUT Student Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 240456890"
                                    value={newStudent.studentNumber}
                                    onChange={(e) => setNewStudent({ ...newStudent, studentNumber: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 font-mono text-text-main"
                                />
                                {newStudent.studentNumber.trim() && (
                                    <p className="mt-1 text-[11px] text-brand-mint font-mono">
                                        Email: {newStudent.studentNumber.trim()}@mycput.ac.za
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Full Student Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Ben Thamiso"
                                    value={newStudent.name}
                                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Initial Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newStudent.password}
                                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 font-mono text-text-main"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newStudent.confirmPassword}
                                    onChange={(e) => setNewStudent({ ...newStudent, confirmPassword: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 font-mono text-text-main"
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-ui-border flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-text-main font-semibold rounded-xl text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-primary text-white font-semibold rounded-xl text-xs hover:bg-brand-primary-hover shadow-sm"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>{submitting ? 'Registering...' : 'Register Student'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* EDIT STUDENT RECORD */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <form onSubmit={handleUpdateSubmit} className="bg-card-bg border border-ui-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-ui-border pb-3">
                            <h3 className="font-heading font-bold text-text-main text-base">Edit Student Record</h3>
                            <button type="button" onClick={() => setEditingStudent(null)} className="p-1 text-text-muted hover:text-text-main">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Student ID (Read Only)</label>
                                <input
                                    type="text"
                                    value={editFormData.studentNumber}
                                    disabled
                                    className="w-full bg-app-bg border border-ui-border rounded-xl px-3 py-2 font-mono text-brand-accent cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-text-muted mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    required
                                    className="w-full bg-app-bg border border-ui-border focus:border-brand-accent rounded-xl px-3 py-2 text-text-main"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block font-semibold text-text-muted">CPUT Institutional Email</label>
                                    <span className="text-[10px] text-text-subtle font-mono">Bound to Student Number</span>
                                </div>
                                <input
                                    type="email"
                                    value={editFormData.email}
                                    disabled
                                    className="w-full bg-app-bg/60 border border-ui-border rounded-xl px-3 py-2 text-text-muted font-mono cursor-not-allowed text-xs"
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-ui-border flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setEditingStudent(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-text-main font-semibold rounded-xl text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-xl text-xs hover:bg-brand-primary-hover shadow-sm"
                            >
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
}