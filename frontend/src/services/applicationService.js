import apiClient from './apiClient';

export const applyForInternship = async (studentNumber, internshipId) => {
    try {
        const response = await apiClient.post('/application/create', {
            studentNumber,
            internshipId
        });
        return response.data;
    } catch (error) {
        console.error("Error applying for internship:", error);
        throw error.response?.data || "Failed to submit application.";
    }
};

export const getStudentApplications = async (studentNumber) => {
    try {
        const response = await apiClient.get(`/application/student/${studentNumber}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student applications:", error);
        throw error;
    }
};

// For Employers: Fetch all applicants across listings
export const getAllApplications = async () => {
    try {
        const response = await apiClient.get('/application/getAll');
        return response.data;
    } catch (error) {
        console.error("Error fetching all applications:", error);
        throw error;
    }
};

// For Employers: Fetch applicants for a specific internship ID
export const getCompanyApplications = async (companyId) => {
    try {
        const response = await apiClient.get(`/application/company/${companyId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching company applications:", error);
        throw error;
    }
};

// For Employers: Live decision button (Approved / Rejected)
export const updateApplicationStatus = async (applicationId, status) => {
    try {
        const response = await apiClient.put(`/application/update/${applicationId}`, null, {
            params: { status }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating application status:", error);
        throw error;
    }
};