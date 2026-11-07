import apiClient from './apiClient';

export const createInternship = async (internshipData) => {
    try {
        const response = await apiClient.post('/internship/create', internshipData);
        return response.data;
    } catch (error) {
        console.error("Error creating internship:", error);
        throw error.response?.data || "Failed to create internship.";
    }
};

export const getAllInternships = async () => {
    try {
        const response = await apiClient.get('/internship/getAll');
        return response.data;
    } catch (error) {
        console.error("Error fetching internships:", error);
        throw error.response?.data || "Failed to fetch internships.";
    }
};

export const readInternship = async (internshipId) => {
    try {
        const response = await apiClient.get(`/internship/read/${internshipId}`);
        return response.data;
    } catch (error) {
        console.error("Error reading internship:", error);
        throw error.response?.data || "Failed to read internship details.";
    }
};

export const updateInternship = async (internshipData) => {
    try {
        const response = await apiClient.put('/internship/update', internshipData);
        return response.data;
    } catch (error) {
        console.error("Error updating internship:", error);
        throw error.response?.data || "Failed to update internship.";
    }
};

export const deleteInternship = async (internshipId) => {
    try {
        const response = await apiClient.delete(`/internship/delete/${internshipId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting internship:", error);
        throw error.response?.data || "Failed to delete internship.";
    }
};

export const getInternshipsByTitle = async (title) => {
    try {
        const response = await apiClient.get('/internship/getByTitle', {
            params: { title }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching internships by title:", error);
        throw error.response?.data || "Search failed.";
    }
};

export const getInternshipsByLocation = async (location) => {
    try {
        const response = await apiClient.get('/internship/getByLocation', {
            params: { location }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching internships by location:", error);
        throw error.response?.data || "Search failed.";
    }
};

export const getInternshipsByCompany = async (companyId) => {
    try {
        const response = await apiClient.get(`/internship/company/${companyId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching company internships:", error);
        throw error.response?.data || "Failed to fetch company internships.";
    }
};

/**
 * Server-side search. All params optional:
 * { q, location, workMode: 'ONSITE'|'HYBRID'|'REMOTE', field, paidOnly, openOnly, sort: 'newest'|'deadline'|'stipend'|'title', limit }
 * Returns InternshipResponse[] (includes companyName, companyIndustry, open, applicantCount).
 */
export const searchInternships = async (params = {}) => {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined && v !== false));
    const response = await apiClient.get('/internship/search', { params: clean });
    return response.data;
};

/** Enriched single internship (InternshipResponse). */
export const getInternshipDetails = async (internshipId) => {
    const response = await apiClient.get(`/internship/details/${internshipId}`);
    return response.data;
};