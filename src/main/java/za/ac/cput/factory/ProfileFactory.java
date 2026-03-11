package za.ac.cput.factory;

import za.ac.cput.domain.Profile;
import java.util.List;
import java.util.UUID;

/*
 * ProfileFactory.java
 * Profile factory class
 * Author: Oratilwe Komane (230716873)
 * Date: 11 March 2026
 */
public class ProfileFactory {
    public static Profile buildProfile(String bio, List<String> skills, String resumeLink) {

        if (bio == null || bio.isEmpty() ||
                skills == null || skills.isEmpty() ||
                resumeLink == null || resumeLink.isEmpty()) {
            return null;
        }

        String profileId = UUID.randomUUID().toString();

        return new Profile.Builder()
                .setProfileId(profileId)
                .setBio(bio)
                .setSkills(skills)
                .setResumeLink(resumeLink)
                .build();
    }
}