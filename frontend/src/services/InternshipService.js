import apiClient from './apiClient';

export const createInternship = async (internshipData) => {
    try {
        const response = await apiClient.post('/internship/create', internshipData);
        return response.data;
    } catch (error) {
        console.error("Error creating internship:", error);
        throw error;
    }
};

export const getAllInternships = async () => {
    try {
        const response = await apiClient.get('/internship/getAll');
        return response.data;
    } catch (error) {
        console.error("Error getting internships:", error);
        throw error;
    }
};
