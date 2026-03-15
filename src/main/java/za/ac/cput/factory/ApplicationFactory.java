package za.ac.cput.factory;

import za.ac.cput.domain.Application;
import za.ac.cput.domain.Student;
import za.ac.cput.domain.Internship;

import java.time.LocalDateTime;

/*
 * ApplicationFactory.java
 * Application factory class
 * Author: Mojalefa Mabotja (223227498)
 * Date: 11 March 2026
 */

public class ApplicationFactory {

    public static Application createApplication(String applicationId, String status, LocalDateTime dateApplied, Student student, Internship internship){

        if(applicationId == null || applicationId.isEmpty() ||
        status == null || status.isEmpty() ||
        dateApplied == null ||
        student == null ||
        internship == null) {
            return null;
        }

        return new Application.Builder()
                .setApplicationId(applicationId)
                .setStatus(status)
                .setDateApplied(dateApplied)
                .setStudent(student)
                .setInternship(internship)
                .build();
    }
}
