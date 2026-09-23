package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.Student;
import za.ac.cput.domain.Internship;
import za.ac.cput.factory.ApplicationFactory;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

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
    void createApplication(){
        Application application = ApplicationFactory.createApplication("APP001", student, internship);
        assertNotNull(application);
        System.out.println(application);
    }

    @Test
    void createApplicationWithNullId(){
        Application application = ApplicationFactory.createApplication(null,  student, internship);
        assertNull(application);
    }
    @Test
    void createApplicationWithEmptyStatus(){
        Application application = ApplicationFactory.createApplication("APP002", student, internship);
        assertNull(application);
    }
    @Test
    void createApplicationWithNullDate(){
        Application application = ApplicationFactory.createApplication("APP003", student, internship);
        assertNull(application);
    }
    @Test
    void createApplicationWithNullStudent() {
        Application application = ApplicationFactory.createApplication("APP004", null, internship);
        assertNull(application);
    }
    @Test
    void createApplicationWithNullInternship(){
        Application application = ApplicationFactory.createApplication("APP005", student, null);
        assertNull(application);
    }
}
