package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.ApplicationStatus;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Student;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ApplicationFactoryTest {

    Student student = new Student.Builder()
            .setStudentNumber("223227498")
            .setName("Mojalefa")
            .setEmail("223227498@mycput.ac.za")
            .setPassword("@brave24")
            .build();

    Internship internship = new Internship.Builder()
            .setInternshipId("INT001")
            .setTitle("Software Developer Intern")
            .setDescription("Java Internship")
            .setLocation("Cape Town")
            .setDeadline(LocalDateTime.now().plusDays(10))
            .build();

    @Test
    void createApplication_startsAsPending() {
        Application application = ApplicationFactory.createApplication(student, internship);
        assertNotNull(application);
        assertNotNull(application.getApplicationId());
        assertEquals(ApplicationStatus.PENDING, application.getStatus());
        assertNotNull(application.getDateApplied());
        assertNull(application.getCoverLetter());
    }

    @Test
    void createApplication_keepsTrimmedCoverLetter() {
        Application application = ApplicationFactory.createApplication(student, internship, "  I love Java.  ");
        assertEquals("I love Java.", application.getCoverLetter());
    }

    @Test
    void createApplication_rejectsOverlongCoverLetter() {
        String tooLong = "a".repeat(ApplicationFactory.MAX_COVER_LETTER_LENGTH + 1);
        assertThrows(IllegalArgumentException.class,
                () -> ApplicationFactory.createApplication(student, internship, tooLong));
    }

    @Test
    void createApplicationWithNullStudent() {
        assertThrows(IllegalArgumentException.class,
                () -> ApplicationFactory.createApplication(null, internship));
    }

    @Test
    void createApplicationWithNullInternship() {
        assertThrows(IllegalArgumentException.class,
                () -> ApplicationFactory.createApplication(student, null));
    }
}