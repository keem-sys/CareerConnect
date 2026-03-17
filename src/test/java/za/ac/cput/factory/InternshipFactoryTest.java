package za.ac.cput.factory;

/*
Internship.java
InternshipFactoryTest
Author: Refilwe Mabena (231013051)
Date: 14 March 2026
*/

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Internship;

import za.ac.cput.factory.InternshipFactory;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class InternshipFactoryTest {
    @Test
    void createInternship() {

        Internship internship = InternshipFactory.createInternship(
                "L987",
                "Software Developer Intern",
                "Java development internship",
                "Cape Town",
                LocalDateTime.of(2026, 5, 30, 23, 59)
        );

        assertNotNull(internship, "Internship should be created successfully");
        System.out.println(internship);
    }
    @Test
    void createInternshipFail(){

        Internship internship = InternshipFactory.createInternship(
                "",
                "Developer Intern",
                "Java development internship",
                "Cape Town",
                LocalDateTime.now()
        );

        assertNull(internship, "Internship should be null when ID is empty");


    }

}
