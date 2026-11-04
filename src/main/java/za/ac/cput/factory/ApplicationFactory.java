package za.ac.cput.factory;

import za.ac.cput.domain.Application;
import za.ac.cput.domain.ApplicationStatus;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Student;

import java.time.LocalDateTime;
import java.util.UUID;

/*
 * ApplicationFactory.java
 * Application factory class
 * Author: Mojalefa Mabotja (223227498)
 * Date: 11 March 2026
 */
public class ApplicationFactory {

    public static final int MAX_COVER_LETTER_LENGTH = 2000;

    public static Application createApplication(Student student, Internship internship, String coverLetter) {
        if (student == null)
            throw new IllegalArgumentException("Student cannot be null");
        if (internship == null)
            throw new IllegalArgumentException("Internship cannot be null");

        String letter = coverLetter == null || coverLetter.isBlank() ? null : coverLetter.trim();
        if (letter != null && letter.length() > MAX_COVER_LETTER_LENGTH)
            throw new IllegalArgumentException("Cover letter cannot exceed " + MAX_COVER_LETTER_LENGTH + " characters");

        LocalDateTime now = LocalDateTime.now();
        return new Application.Builder()
                .setApplicationId(UUID.randomUUID().toString())
                .setStatus(ApplicationStatus.PENDING)
                .setDateApplied(now)
                .setUpdatedAt(now)
                .setCoverLetter(letter)
                .setStudent(student)
                .setInternship(internship)
                .build();
    }

    public static Application createApplication(Student student, Internship internship) {
        return createApplication(student, internship, null);
    }
}