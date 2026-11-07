package za.ac.cput.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/*
 * DashboardStats.java
 * Read-only figures shown on the landing page and each role's dashboard.
 */
public final class DashboardStats {

    private DashboardStats() {
    }

    public record PublicStats(long openInternships, long companies, long students, long placements) {
    }

    public record StudentStats(
            long totalApplications,
            long activeApplications,
            long offers,
            Map<String, Long> byStatus,
            int profileCompleteness,
            List<String> missingProfileItems
    ) {
    }

    public record PostingSummary(String internshipId, String title, boolean open, LocalDateTime deadline,
                                 long applicants, long pendingReview) {
    }

    public record CompanyStats(
            long totalPostings,
            long activePostings,
            long totalApplicants,
            long awaitingReview,
            long shortlisted,
            long hired,
            Map<String, Long> byStatus,
            List<PostingSummary> postings
    ) {
    }

    public record AdminStats(
            long students,
            long companies,
            long internships,
            long openInternships,
            long applications,
            long placements,
            double placementRate,
            Map<String, Long> byStatus
    ) {
    }
}