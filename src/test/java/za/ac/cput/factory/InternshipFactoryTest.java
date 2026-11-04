package za.ac.cput.factory;

/*
InternshipFactoryTest
Author: Refilwe Mabena (231013051)
Date: 14 March 2026
*/

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Internship;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class InternshipFactoryTest {

    @Test
    void createInternship() {
        Internship internship = InternshipFactory.createInternship(
                "L987",
                "COMP-001",
                "Software Developer Intern",
                "Java development internship",
                "Cape Town",
                LocalDateTime.of(2030, 5, 30, 23, 59)
        );

        assertNotNull(internship, "Internship should be created successfully");
        assertEquals("COMP-001", internship.getCompanyId());
        assertEquals("Software Developer Intern", internship.getTitle());
        assertEquals("Cape Town", internship.getLocation());
    }

    @Test
    void createInternshipFail() {
        Internship internship = InternshipFactory.createInternship(
                "",
                "COMP-001",
                "Developer Intern",
                "Java development internship",
                "Cape Town",
                LocalDateTime.now()
        );

        assertNull(internship, "Internship should be null when ID is empty");
    }

    @Test
    void createInternshipFailsWithoutCompany() {
        Internship internship = InternshipFactory.createInternship(
                "L988",
                null,
                "Developer Intern",
                "Java development internship",
                "Cape Town",
                LocalDateTime.now().plusDays(5)
        );

        assertNull(internship, "Internship should be null when company is missing");
    }
}