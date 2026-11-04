package za.ac.cput.domain;

/*
 * Internship.java
 * Internship JPA Entity class with Company Tenant Isolation
 * Author: Refilwe Mabena (231013051) / Updated: Ebenezer Kouakou (230480152)
 * Date: 19 October 2026
 */

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "internship")
public class Internship {

    @Id
    @Column(name = "internship_id", nullable = false, unique = true)
    private String internshipId;

    @Column(name = "company_id", nullable = false)
    private String companyId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false, length = 1000)
    private String description;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode")
    private WorkMode workMode;

    /** Monthly stipend in ZAR; null or 0 means unpaid / not disclosed. */
    @Column(name = "stipend")
    private Integer stipend;

    @Column(name = "duration_months")
    private Integer durationMonths;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "field_of_study")
    private String fieldOfStudy;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "internship_skills", joinColumns = @JoinColumn(name = "internship_id"))
    @Column(name = "skill")
    private List<String> requiredSkills = new ArrayList<>();

    @Column(name = "positions")
    private Integer positions;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    protected Internship() {
    }

    private Internship(Builder builder) {
        this.internshipId = builder.internshipId;
        this.companyId = builder.companyId;
        this.title = builder.title;
        this.description = builder.description;
        this.location = builder.location;
        this.deadline = builder.deadline;
        this.workMode = builder.workMode;
        this.stipend = builder.stipend;
        this.durationMonths = builder.durationMonths;
        this.startDate = builder.startDate;
        this.fieldOfStudy = builder.fieldOfStudy;
        this.requiredSkills = builder.requiredSkills == null ? new ArrayList<>() : new ArrayList<>(builder.requiredSkills);
        this.positions = builder.positions;
        this.createdAt = builder.createdAt;
    }

    public String getInternshipId() { return internshipId; }
    public String getCompanyId() { return companyId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public LocalDateTime getDeadline() { return deadline; }
    public WorkMode getWorkMode() { return workMode; }
    public Integer getStipend() { return stipend; }
    public Integer getDurationMonths() { return durationMonths; }
    public LocalDate getStartDate() { return startDate; }
    public String getFieldOfStudy() { return fieldOfStudy; }
    public List<String> getRequiredSkills() { return requiredSkills; }
    public Integer getPositions() { return positions; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setInternshipId(String internshipId) { this.internshipId = internshipId; }
    public void setCompanyId(String companyId) { this.companyId = companyId; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    public void setWorkMode(WorkMode workMode) { this.workMode = workMode; }
    public void setStipend(Integer stipend) { this.stipend = stipend; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills == null ? new ArrayList<>() : new ArrayList<>(requiredSkills);
    }
    public void setPositions(Integer positions) { this.positions = positions; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    /** True while applications are still being accepted. */
    public boolean isOpen() {
        return deadline != null && deadline.isAfter(LocalDateTime.now());
    }

    @Override
    public String toString() {
        return "Internship{" +
                "internshipId='" + internshipId + '\'' +
                ", companyId='" + companyId + '\'' +
                ", title='" + title + '\'' +
                ", location='" + location + '\'' +
                ", workMode=" + workMode +
                ", stipend=" + stipend +
                ", deadline=" + deadline +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Internship that)) return false;
        return Objects.equals(internshipId, that.internshipId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(internshipId);
    }

    public static class Builder {
        private String internshipId;
        private String companyId;
        private String title;
        private String description;
        private String location;
        private LocalDateTime deadline;
        private WorkMode workMode;
        private Integer stipend;
        private Integer durationMonths;
        private LocalDate startDate;
        private String fieldOfStudy;
        private List<String> requiredSkills = new ArrayList<>();
        private Integer positions;
        private LocalDateTime createdAt;

        public Builder setInternshipId(String internshipId) { this.internshipId = internshipId; return this; }
        public Builder setCompanyId(String companyId) { this.companyId = companyId; return this; }
        public Builder setTitle(String title) { this.title = title; return this; }
        public Builder setDescription(String description) { this.description = description; return this; }
        public Builder setLocation(String location) { this.location = location; return this; }
        public Builder setDeadline(LocalDateTime deadline) { this.deadline = deadline; return this; }
        public Builder setWorkMode(WorkMode workMode) { this.workMode = workMode; return this; }
        public Builder setStipend(Integer stipend) { this.stipend = stipend; return this; }
        public Builder setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; return this; }
        public Builder setStartDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public Builder setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; return this; }
        public Builder setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; return this; }
        public Builder setPositions(Integer positions) { this.positions = positions; return this; }
        public Builder setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Builder copy(Internship internship) {
            this.internshipId = internship.internshipId;
            this.companyId = internship.companyId;
            this.title = internship.title;
            this.description = internship.description;
            this.location = internship.location;
            this.deadline = internship.deadline;
            this.workMode = internship.workMode;
            this.stipend = internship.stipend;
            this.durationMonths = internship.durationMonths;
            this.startDate = internship.startDate;
            this.fieldOfStudy = internship.fieldOfStudy;
            this.requiredSkills = internship.requiredSkills;
            this.positions = internship.positions;
            this.createdAt = internship.createdAt;
            return this;
        }

        public Internship build() {
            return new Internship(this);
        }
    }
}
