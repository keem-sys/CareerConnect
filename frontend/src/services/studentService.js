import apiClient from './apiClient';

export const createStudent = async (studentData) => {
    try {
        const response = await apiClient.post('/student/create', studentData);
        return response.data;
    } catch (error) {
        console.error("Error creating student:", error);
        throw error;
    }
};

export const readStudent = async (studentNumber) => {
    try {
        const response = await apiClient.get(`/student/read/${studentNumber}`);
        return response.data;
    } catch (error) {
        console.error("Error reading student:", error);
        throw error;
    }
}

export const updateStudent = async (studentData) => {
    try {
        const response = await apiClient.put(
            `/student/update/${studentData.studentNumber}`,
            {
                name: studentData.name,
                email: studentData.email
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating student:", error);
        throw error;
    }
};

export const deleteStudent = async (studentNumber) => {
    try {
        const response = await apiClient.delete(`/student/delete/${studentNumber}`);
        return response.data;
    }catch (error) {
        console.error("Error deleting student:", error);
        throw error;
    }
}

export const getAllStudents = async () => {
    try {
        const response = await apiClient.get('/student/getAll');
        return response.data;
    } catch (error) {
        console.error("Error getting students:", error);
        throw error;
    }
}

export const getStudentByEmail = async (email) => {
    try {
        const response = await apiClient.get('/student/getByEmail', {
            params: { email }
        });
        return response.data;
    } catch (error) {
        console.error("Error getting student by email:", error);
        throw error;
    }
}

export const getStudentsByName = async (name) => {
    try {
        const response = await apiClient.get(`/student/getByName`, {
            params: { name }
        });
        return response.data;
    } catch (error) {
        console.error("Error getting student by name:", error);
        throw error;
    }
}