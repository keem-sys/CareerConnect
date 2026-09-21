
import apiClient from './apiClient';

const internshipService = {
    createInternship: async (internshipData) => {
        const response = await apiClient.post(
            '/internship/create',
            internshipData
        );
        return response.data;
    },

    getAllInternships: async () => {
        const response = await apiClient.get('/internship/getAll');
        return response.data;
    },
};

export default internshipService;
