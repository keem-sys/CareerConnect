import apiClient from './apiClient';

export const createProfile = async (profileData) => {
    const response = await apiClient.post('/profile/create', profileData);
    return response.data;
};

export const getProfile = async (id) => {
    const response = await apiClient.get(`/profile/read/${id}`);
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await apiClient.put('/profile/update', profileData);
    return response.data;
};

export const getProfileByStudentNumber = async (studentNumber) => {
    const response = await apiClient.get(`/profile/student/${studentNumber}`);
    return response.data;
};