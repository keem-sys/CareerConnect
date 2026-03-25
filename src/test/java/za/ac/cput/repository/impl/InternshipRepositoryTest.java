package za.ac.cput.test;

/*
InternshipRepositoryTest.java
InternshipRepositoryTest class
Author: Refilwe Mabena (231013051)
Date: 24 March 2026
*/
import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Internship;
import za.ac.cput.repository.impl.InternshipRepository;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class InternshipRepositoryTest {

    private static InternshipRepository repository = InternshipRepository.getRepository();

    private Internship internship = new Internship.Builder()
            .setInternshipId("I001")
            .setTitle("Software Intern")
            .setDescription("Java Dev")
            .setLocation("Cape Town")
            .setDeadline(LocalDateTime.now())
            .build();

    @Test
    void create() {
        Internship created = repository.create(internship);
        assertNotNull(created);
        System.out.println(created);
    }

    @Test
    void read() {
        Internship created = repository.create(internship);
        Internship read = repository.read(created.getInternship());
        assertNotNull(read);
    }

    @Test
    void update () {
        Intership updatedInternship = new Internship.Builder()
                .copy(internship)
                .setTitle("Updated Title")
                .build();

        Internship updated = repository.update(updatedInternship);
        assertEquals("Updated Title", updated.getTitle());
    }

    @Test
    void delete() {
        repository.create(internship);
        boolean success = repository.delete(internship.getInternshipId());
        assertTrue(success);
    }

    @Test
    void getAll(){
        repository.create(internship);
        assertFalse(repository.getAll().isEmpty());
    }
}
