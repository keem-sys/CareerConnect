import apiClient from './apiClient';

/**
 * Submit a new application for an internship.
 *
 * Backend expects:
 * {
 *   student: {
 *     studentNumber: "..."
 *   },
 *   internship: {
 *     internshipId: "..."
 *   }
 * }
 */
export const applyToInternship = async ({
                                            studentNumber,
                                            internshipId,
                                        }) => {
    const response = await apiClient.post('/application/create', {
        student: {
            studentNumber,
        },
        internship: {
            internshipId,
        },
    });

    return response.data;
};

/**
 * Fetch a single application by ID.
 */
export const getApplication = async (applicationId) => {
    const response = await apiClient.get(
        `/application/read/${applicationId}`
    );

    return response.data;
};

/**
 * Fetch all applications submitted by a student.
 *
 * studentId = student's studentNumber.
 */
export const getApplicationsByStudent = async (studentId) => {
    const response = await apiClient.get(
        `/application/student/${studentId}`
    );

    return response.data;
};

/**
 * Fetch all applications for an internship.
 */
export const getApplicationsByInternship = async (internshipId) => {
    const response = await apiClient.get(
        `/application/internship/${internshipId}`
    );

    return response.data;
};

/**
 * Fetch applications by status.
 *
 * Valid statuses:
 * Pending
 * Accepted
 * Rejected
 */
export const getApplicationsByStatus = async (status) => {
    const response = await apiClient.get(
        `/application/status/${status}`
    );

    return response.data;
};

/**
 * Fetch every application.
 */
export const getAllApplications = async () => {
    const response = await apiClient.get(
        '/application/getAll'
    );

    return response.data;
};

/**
 * Update an application's status.
 *
 * Backend:
 * PUT /api/application/update/{applicationId}?status=Accepted
 */
export const updateApplicationStatus = async (
    applicationId,
    status
) => {
    const response = await apiClient.put(
        `/application/update/${applicationId}`,
        null,
        {
            params: {
                status,
            },
        }
    );

    return response.data;
};

/**
 * Withdraw/delete an application.
 */
export const withdrawApplication = async (applicationId) => {
    await apiClient.delete(
        `/application/delete/${applicationId}`
    );
};