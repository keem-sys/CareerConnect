package za.ac.cput.repository.impl;

/*
 * ApplicationRepositoryTest.java
 * ApplicationRepositoryTest class
 * Author: Mojalefa Mabotja (223227498)
 * Date: 21 March 2026
 */

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Student;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ApplicationRepositoryTest {

    private ApplicationRepository repository;
    private Application application;

    @BeforeEach
    void setup() {
        repository = ApplicationRepository.getRepository();

        Student student = new Student.Builder()
                .setStudentNumber("ST001")
                .setName("Mary Jane")
                .setEmail("maryj@cput.ac.za")
                .setPassword("12332")
                .build();

        Internship internship = new Internship.Builder()
                .setInternshipId("INT001")
                .setTitle("Software Intern")
                .setDescription("Java Dev")
                .setLocation("Cape Town")
                .setDeadline(LocalDateTime.now().plusDays(5))
                .build();

        application = new Application.Builder()
                .setApplicationId("APP001")
                .setStatus("Pending")
                .setDateApplied(LocalDateTime.now())
                .setStudent(student)
                .setInternship(internship)
                .build();
    }

    @Test
    void create() {
        Application created = repository.create(application);
        assertNotNull(created);
        assertEquals(application.getApplicationId(), created.getApplicationId());
    }

    @Test
    void read(){
        repository.create(application);
        Application read = repository.read(application.getApplicationId());
        assertNotNull(read);
    }

    @Test
    void update() {
        repository.create(application);

        Application updated = new Application.Builder()
                .copy(application)
                .setStatus("Approved")
                .build();

        Application result = repository.update(updated);
        assertNotNull(result);
        assertEquals("Approved", result.getStatus());
    }

    @Test
    void delete(){
        repository.create(application);
        boolean deleted = repository.delete(application.getApplicationId());
        assertTrue(deleted);
    }

    @Test
    void getAll(){
        repository.create(application);
        List<Application> all = repository.getAll();
        assertFalse(all.isEmpty());
    }

}
