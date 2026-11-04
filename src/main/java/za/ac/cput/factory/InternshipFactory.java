package za.ac.cput.factory;

/*
 * InternshipFactory.java
 * Factory for creating verified Internship entities with Company ID
 * Author: Refilwe Mabena (231013051) / Updated: Ebenezer Kouakou (230480152)
 * Date: 19 October 2026
 */

import java.time.LocalDateTime;
import za.ac.cput.domain.Internship;

public class InternshipFactory {

    public static Internship createInternship(String internshipId,
                                              String companyId,
                                              String title,
                                              String description,
                                              String location,
                                              LocalDateTime deadline) {
        if (isNullOrEmpty(internshipId) ||
                isNullOrEmpty(companyId) ||
                isNullOrEmpty(title) ||
                isNullOrEmpty(description) ||
                isNullOrEmpty(location) ||
                deadline == null) {
            return null;
        }

        return new Internship.Builder()
                .setInternshipId(internshipId)
                .setCompanyId(companyId)
                .setTitle(title)
                .setDescription(description)
                .setLocation(location)
                .setDeadline(deadline)
                .build();
    }

    private static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}