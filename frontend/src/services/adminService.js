import apiClient from './apiClient';

/**
 * Create a new administrator account (e.g. secondary WIL Coordinator)
 * @param {Object} adminData - { name, email, password }
 */
export const createAdmin = async (adminData) => {
    try {
        const response = await apiClient.post('/admin/create', adminData);
        return response.data;
    } catch (error) {
        console.error("Error creating admin:", error);
        throw error.response?.data || "Failed to create administrator account.";
    }
};

/**
 * Fetch an administrator profile by ID
 * @param {string} adminId
 */
export const readAdmin = async (adminId) => {
    try {
        const response = await apiClient.get(`/admin/read/${adminId}`);
        return response.data;
    } catch (error) {
        console.error("Error reading admin:", error);
        throw error.response?.data || "Failed to load administrator details.";
    }
};

/**
 * Update administrator details or password
 * @param {string} adminId
 * @param {Object} adminData - { name, email, password }
 */
export const updateAdmin = async (adminId, adminData) => {
    try {
        const response = await apiClient.put(`/admin/update/${adminId}`, adminData);
        return response.data;
    } catch (error) {
        console.error("Error updating admin:", error);
        throw error.response?.data || "Failed to update administrator profile.";
    }
};

/**
 * Delete an administrator account by ID
 * @param {string} adminId
 */
export const deleteAdmin = async (adminId) => {
    try {
        const response = await apiClient.delete(`/admin/delete/${adminId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting admin:", error);
        throw error.response?.data || "Failed to delete administrator account.";
    }
};

/**
 * Fetch all registered platform administrators
 */
export const getAllAdmins = async () => {
    try {
        const response = await apiClient.get('/admin/getAll');
        return response.data;
    } catch (error) {
        console.error("Error fetching admins:", error);
        throw error.response?.data || "Failed to load administrators.";
    }
};

/**
 * Fetch administrator details by email address
 * @param {string} email
 */
export const getAdminByEmail = async (email) => {
    try {
        const response = await apiClient.get('/admin/getByEmail', {
            params: { email }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching admin by email:", error);
        throw error.response?.data || "Administrator not found.";
    }
};