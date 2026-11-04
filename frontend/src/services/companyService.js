import apiClient from './apiClient';

/*
 * companyService.js
 * Frontend Service for consuming Spring Boot Company REST APIs
 */

export const createCompany = async (companyData) => {
    try {
        const response = await apiClient.post('/company/create', companyData);
        return response.data;
    } catch (error) {
        console.error("Error creating company:", error);
        throw error.response?.data || "Company registration failed.";
    }
};

export const readCompany = async (companyId) => {
    try {
        const response = await apiClient.get(`/company/read/${companyId}`);
        return response.data;
    } catch (error) {
        console.error("Error reading company:", error);
        throw error;
    }
};

export const updateCompany = async (companyData) => {
    try {
        const response = await apiClient.put('/company/update', companyData);
        return response.data;
    } catch (error) {
        console.error("Error updating company:", error);
        throw error.response?.data || "Failed to update company record.";
    }
};

export const deleteCompany = async (companyId) => {
    try {
        const response = await apiClient.delete(`/company/delete/${companyId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting company:", error);
        throw error;
    }
};

export const getAllCompanies = async () => {
    try {
        const response = await apiClient.get('/company/getAll');
        return response.data;
    } catch (error) {
        console.error("Error fetching companies:", error);
        throw error;
    }
};

export const getCompaniesByName = async (name) => {
    try {
        const response = await apiClient.get('/company/getByName', {
            params: { name }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching companies by name:", error);
        throw error;
    }
};

export const getCompaniesByIndustry = async (industry) => {
    try {
        const response = await apiClient.get('/company/getByIndustry', {
            params: { industry }
        });
        return response.data;
    } catch (error) {
        console.error("Error filtering companies by industry:", error);
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