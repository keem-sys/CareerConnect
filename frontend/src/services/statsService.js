import apiClient from './apiClient';

/** { openInternships, companies, students, placements } - no login required */
export const getPublicStats = async () => (await apiClient.get('/stats/public')).data;

/** { totalApplications, activeApplications, offers, byStatus, profileCompleteness, missingProfileItems } */
export const getStudentStats = async (studentNumber) => (await apiClient.get(`/stats/student/${studentNumber}`)).data;

/** { totalPostings, activePostings, totalApplicants, awaitingReview, shortlisted, hired, byStatus,
 *    postings: [{ internshipId, title, open, deadline, applicants, pendingReview }] } */
export const getCompanyStats = async (companyId) => (await apiClient.get(`/stats/company/${companyId}`)).data;

/** { students, companies, internships, openInternships, applications, placements, placementRate, byStatus } */
export const getAdminStats = async () => (await apiClient.get('/stats/admin')).data;