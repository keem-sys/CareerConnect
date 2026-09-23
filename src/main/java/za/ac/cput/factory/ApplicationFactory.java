package za.ac.cput.factory;

import za.ac.cput.domain.Application;
import za.ac.cput.domain.Student;
import za.ac.cput.domain.Internship;

import java.time.LocalDateTime;
import java.util.UUID;

/*
 * ApplicationFactory.java
 * Application factory class
 * Author: Mojalefa Mabotja (223227498)
 * Date: 11 March 2026
 */

public class ApplicationFactory {

    public static Application createApplication(String status, Student student, Internship internship){
        if(status == null || status.isEmpty())
            throw new IllegalArgumentException("Application Status cannot be null or empty");
        if(student == null)
            throw new IllegalArgumentException("Student cannot be null");
        if(internship == null)
            throw new IllegalArgumentException("Internship cannot be null");

        return new Application.Builder()
                .setApplicationId(UUID.randomUUID().toString())
                .setStatus(status)
                .setDateApplied(LocalDateTime.now())
                .setStudent(student)
                .setInternship(internship)
                .build();
    }
}
