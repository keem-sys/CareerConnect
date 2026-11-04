package za.ac.cput.domain;

/*
 * Internship.java
 * Internship JPA Entity class with Company Tenant Isolation
 * Author: Refilwe Mabena (231013051) / Updated: Ebenezer Kouakou (230480152)
 * Date: 19 October 2026
 */

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
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

    protected Internship() {
    }

    private Internship(Builder builder) {
        this.internshipId = builder.internshipId;
        this.companyId = builder.companyId;
        this.title = builder.title;
        this.description = builder.description;
        this.location = builder.location;
        this.deadline = builder.deadline;
    }

    // Getters
    public String getInternshipId() {
        return internshipId;
    }

    public String getCompanyId() {
        return companyId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setInternshipId(String internshipId) {
        this.internshipId = internshipId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    @Override
    public String toString() {
        return "Internship{" +
                "internshipId='" + internshipId + '\'' +
                ", companyId='" + companyId + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", location='" + location + '\'' +
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

        public Builder setInternshipId(String internshipId) {
            this.internshipId = internshipId;
            return this;
        }

        public Builder setCompanyId(String companyId) {
            this.companyId = companyId;
            return this;
        }

        public Builder setTitle(String title) {
            this.title = title;
            return this;
        }

        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }

        public Builder setLocation(String location) {
            this.location = location;
            return this;
        }

        public Builder setDeadline(LocalDateTime deadline) {
            this.deadline = deadline;
            return this;
        }

        public Builder copy(Internship internship) {
            this.internshipId = internship.internshipId;
            this.companyId = internship.companyId;
            this.title = internship.title;
            this.description = internship.description;
            this.location = internship.location;
            this.deadline = internship.deadline;
            return this;
        }

        public Internship build() {
            return new Internship(this);
        }
    }
}