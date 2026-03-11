package za.ac.cput.domain;

import java.util.List;
import java.util.Objects;

/*
 * Profile.java
 * Profile entity class
 * Author: Oratilwe Komane (230716873)
 * Date: 11 March 2026
 */
public class Profile {
    private final String profileId;
    private final String bio;
    private final List<String> skills;
    private final String resumeLink;

    private Profile(Builder builder) {
        this.profileId = builder.profileId;
        this.bio = builder.bio;
        this.skills = builder.skills;
        this.resumeLink = builder.resumeLink;
    }

    public String getProfileId() { return profileId; }
    public String getBio() { return bio; }
    public List<String> getSkills() { return skills; }
    public String getResumeLink() { return resumeLink; }

    @Override
    public String toString() {
        return "Profile{" +
                "profileId='" + profileId + '\'' +
                ", bio='" + bio + '\'' +
                ", skills=" + skills +
                ", resumeLink='" + resumeLink + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Profile profile = (Profile) o;
        return Objects.equals(profileId, profile.profileId) &&
                Objects.equals(bio, profile.bio) &&
                Objects.equals(skills, profile.skills) &&
                Objects.equals(resumeLink, profile.resumeLink);
    }

    @Override
    public int hashCode() {
        return Objects.hash(profileId, bio, skills, resumeLink);
    }

    public static class Builder {
        private String profileId;
        private String bio;
        private List<String> skills;
        private String resumeLink;

        public Builder setProfileId(String profileId) {
            this.profileId = profileId;
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