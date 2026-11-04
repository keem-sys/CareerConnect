package za.ac.cput.dto.response;

import za.ac.cput.domain.Application;
import za.ac.cput.domain.ApplicationStatus;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Student;
import za.ac.cput.domain.WorkMode;

import java.time.LocalDateTime;
import java.util.function.Function;

/*
 * ApplicationResponse.java
 * Safe view of an application: flattens the student (never exposes the password hash)
 * and attaches the company name to the internship summary.
 */
public record ApplicationResponse(
        String applicationId,
        ApplicationStatus status,
        LocalDateTime dateApplied,
        LocalDateTime updatedAt,
        String coverLetter,
        StudentSummary student,
        InternshipSummary internship
) {

    public record StudentSummary(String studentNumber, String name, String email) {
        static StudentSummary from(Student s) {
            return s == null ? null : new StudentSummary(s.getStudentNumber(), s.getName(), s.getEmail());
        }
    }

    public record InternshipSummary(
            String internshipId,
            String title,
            String location,
            WorkMode workMode,
            Integer stipend,
            LocalDateTime deadline,
            String companyId,
            String companyName
    ) {
        static InternshipSummary from(Internship i, String companyName) {
            if (i == null) return null;
            return new InternshipSummary(i.getInternshipId(), i.getTitle(), i.getLocation(), i.getWorkMode(),
                    i.getStipend(), i.getDeadline(), i.getCompanyId(), companyName);
        }
    }

    public static ApplicationResponse from(Application app, Function<String, String> companyNameLookup) {
        Internship internship = app.getInternship();
        String companyName = internship == null || companyNameLookup == null
                ? null
                : companyNameLookup.apply(internship.getCompanyId());
        return new ApplicationResponse(
                app.getApplicationId(),
                app.getStatus(),
                app.getDateApplied(),
                app.getUpdatedAt(),
                app.getCoverLetter(),
                StudentSummary.from(app.getStudent()),
                InternshipSummary.from(internship, companyName)
        );
    }
}