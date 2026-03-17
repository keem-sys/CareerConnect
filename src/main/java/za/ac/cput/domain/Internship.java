package za.ac.cput.domain;

/*
Internship.java
Internship entity class
Author: Refilwe Mabena (231013051)
Date: 10 March 2026
*/

import java.time.LocalDateTime;
import java.util.Objects;

public class Internship {
    private String internshipId;
    private String title;
    private String description;
    private String location;
    private LocalDateTime deadline;

    private Internship(Builder builder) {
        this.internshipId = builder.internshipId;
        this.title = builder.title;
        this.description = builder.description;
        this.location = builder.location;
        this.deadline = builder.deadline;
    }

    //Getter

    public String getInternshipId() {
        return internshipId;
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

    //toString
    @Override
    public String toString() {
        return "Internship{" +
                "internshipId='" + internshipId + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", location='" + location + '\'' +
                ", deadline=" + deadline + 
                '}';
    }

    //equals

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Internship internship)) return false;
        return Objects.equals(internshipId, internship.internshipId);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(internshipId);
    }

    //Builder pattern
    public static class Builder{
        private String internshipId;
        private String title;
        private String description;
        private String location;
        private LocalDateTime deadline;

        public Builder setInternshipId(String internshipId) {
            this.internshipId = internshipId;
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
