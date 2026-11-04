import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-ui-border bg-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-primary-600 text-white flex items-center justify-center">
                        <GraduationCap className="w-4 h-4" />
                    </span>
                    <span>© {new Date().getFullYear()} CareerConnect · A CPUT Application Development capstone</span>
                </div>
                <div className="flex gap-5">
                    <Link to="/internships" className="hover:text-text-main">Internships</Link>
                    <Link to="/companies" className="hover:text-text-main">Companies</Link>
                    <Link to="/signup" className="hover:text-text-main">Join</Link>
                </div>
            </div>
        </footer>
    );
}
