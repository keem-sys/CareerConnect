package za.ac.cput.domain;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.List;
import java.util.Objects;

/*
 * Profile.java
 * Profile entity class
 * Author: Oratilwe Komane (230716873)
 * Date: 11 March 2026
 */
@Entity
public class Profile {

    @Id
    private String profileId;
    private String studentNumber;
    private String bio;

    @ElementCollection
    private List<String> skills;

    private String resumeLink;

    protected Profile() {
    }

    private Profile(Builder builder) {
        this.profileId = builder.profileId;
        this.studentNumber = builder.studentNumber;
        this.bio = builder.bio;
        this.skills = builder.skills;
        this.resumeLink = builder.resumeLink;
    }

    public String getProfileId() { return profileId; }
    public String getStudentNumber() { return studentNumber; }
    public String getBio() { return bio; }
    public List<String> getSkills() { return skills; }
    public String getResumeLink() { return resumeLink; }

    @Override
    public String toString() {
        return "Profile{" +
                "profileId='" + profileId + '\'' +
                ", studentNumber='" + studentNumber + '\'' +
                ", bio='" + bio + '\'' +
                ", skills=" + skills +
                ", resumeLink='" + resumeLink + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Profile profile = (Profile) o;
        return Objects.equals(profileId, profile.profileId) &&
                Objects.equals(studentNumber, profile.studentNumber) &&
                Objects.equals(bio, profile.bio) &&
                Objects.equals(skills, profile.skills) &&
                Objects.equals(resumeLink, profile.resumeLink);
    }

    @Override
    public int hashCode() {
        return Objects.hash(profileId, studentNumber, bio, skills, resumeLink);
    }

    public static class Builder {
        private String profileId;
        private String studentNumber;
        private String bio;
        private List<String> skills;
        private String resumeLink;

        public Builder setProfileId(String profileId) {
            this.profileId = profileId;
            return this;
        }

        public Builder setStudentNumber(String studentNumber) {
            this.studentNumber = studentNumber;
            return this;
        }

        public Builder setBio(String bio) {
            this.bio = bio;
            return this;
        }

        public Builder setSkills(List<String> skills) {
            this.skills = skills;
            return this;
        }

        public Builder setResumeLink(String resumeLink) {
            this.resumeLink = resumeLink;
            return this;
        }

        public Builder copy(Profile profile) {
            this.profileId = profile.profileId;
            this.studentNumber = profile.studentNumber;
            this.bio = profile.bio;
            this.skills = profile.skills;
            this.resumeLink = profile.resumeLink;
            return this;
        }

        public Profile build() {
            return new Profile(this);
        }
    }
}