package za.ac.cput.dto.response;

import za.ac.cput.domain.Company;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.WorkMode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/*
 * InternshipResponse.java
 * Internship listing enriched with the hiring company's public details.
 */
public record InternshipResponse(
        String internshipId,
        String companyId,
        String companyName,
        String companyIndustry,
        String title,
        String description,
        String location,
        WorkMode workMode,
        Integer stipend,
        Integer durationMonths,
        LocalDate startDate,
        String fieldOfStudy,
        List<String> requiredSkills,
        Integer positions,
        LocalDateTime deadline,
        LocalDateTime createdAt,
        boolean open,
        long applicantCount
) {
    public static InternshipResponse from(Internship i, Company company, long applicantCount) {
        return new InternshipResponse(
                i.getInternshipId(),
                i.getCompanyId(),
                company == null ? null : company.getName(),
                company == null ? null : company.getIndustry(),
                i.getTitle(),
                i.getDescription(),
                i.getLocation(),
                i.getWorkMode(),
                i.getStipend(),
                i.getDurationMonths(),
                i.getStartDate(),
                i.getFieldOfStudy(),
                i.getRequiredSkills() == null ? List.of() : List.copyOf(i.getRequiredSkills()),
                i.getPositions(),
                i.getDeadline(),
                i.getCreatedAt(),
                i.isOpen(),
                applicantCount
        );
    }
}