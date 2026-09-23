package za.ac.cput.service;

import org.springframework.stereotype.Service;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Student;
import za.ac.cput.factory.ApplicationFactory;
import za.ac.cput.repository.ApplicationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository repository;

    public ApplicationService(ApplicationRepository repository) {
        this.repository = repository;
    }

    public Application apply(Student student, Internship internship) {
        if(LocalDateTime.now().isAfter(internship.getDeadline())) {
            throw new IllegalArgumentException("Cannot apply for internship after the deadline.");
        }

        if(repository.existsByStudent_StudentNumberAndInternship_InternshipId(student.getStudentNumber(), internship.getInternshipId())) {
            throw new IllegalArgumentException("Student has already applied for this internship.");
        }

        Application application = ApplicationFactory.createApplication("Pending", student, internship);

        return repository.save(application);
    }

    public Optional<Application> read(String applicationId) {
        return repository.findById(applicationId);
    }

    public List<Application> readAll() {
        return repository.findAll();
    }

    public List<Application> readByStudent(String studentNumber) {
        return repository.findByStudent_StudentNumber(studentNumber);
    }

    public List<Application> readByInternship(String internshipId) {
        return repository.findByInternship_InternshipId(internshipId);
    }

    public List<Application> readByStatus(String status) {
        return repository.findByStatus(status);
    }

    public Application updateStatus(String applicationId, String newStatus) {
        Application existing = repository.findById(applicationId).orElseThrow(() -> new IllegalArgumentException("Application not found"));

        Application updated = new Application.Builder()
                .copy(existing)
                .setStatus(newStatus)
                .build();

        return repository.save(updated);
    }
    public void delete(String applicationId) {
        if(!repository.existsById(applicationId)) {
            throw new IllegalArgumentException("Application not found");
        }
        repository.deleteById(applicationId);
    }

}
