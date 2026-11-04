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

export const applyToInternship = async ({ studentNumber, internshipId }) => {
    return applyForInternship(studentNumber, internshipId);
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

export const getApplicationsByStudent = getStudentApplications;

export const getApplication = async (applicationId) => {
    try {
        const response = await apiClient.get(`/application/read/${applicationId}`);
        return response.data;
    } catch (error) {
        console.error("Error reading application:", error);
        throw error;
    }
};

export const getCompanyApplications = async (companyId) => {
    try {
        const response = await apiClient.get(`/application/company/${companyId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching company applications:", error);
        throw error;
    }
};

export const getCompanyApplicants = getCompanyApplications;

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


export const getAllApplications = async () => {
    try {
        const response = await apiClient.get('/application/getAll');
        return response.data;
    } catch (error) {
        console.error("Error fetching all applications:", error);
        throw error;
    }
};

export const getApplicationsByStatus = async (status) => {
    try {
        const response = await apiClient.get(`/application/status/${status}`);
        return response.data;
    } catch (error) {
        console.error("Error filtering by status:", error);
        throw error;
    }
};


export const withdrawApplication = async (applicationId) => {
    try {
        await apiClient.delete(`/application/delete/${applicationId}`);
    } catch (error) {
        console.error("Error withdrawing application:", error);
        throw error;
    }
};