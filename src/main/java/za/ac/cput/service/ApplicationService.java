package za.ac.cput.service;

import org.springframework.stereotype.Service;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Student;
import za.ac.cput.factory.ApplicationFactory;
import za.ac.cput.repository.ApplicationRepository;
import za.ac.cput.repository.InternshipRepository;
import za.ac.cput.repository.StudentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository repository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;

    public ApplicationService(ApplicationRepository repository,
                              StudentRepository studentRepository,
                              InternshipRepository internshipRepository) {
        this.repository = repository;
        this.studentRepository = studentRepository;
        this.internshipRepository = internshipRepository;
    }

    public Application apply(String studentNumber, String internshipId) {
        Student student = studentRepository.findById(studentNumber)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentNumber));

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found with ID: " + internshipId));

        if (internship.getDeadline() != null && LocalDateTime.now().isAfter(internship.getDeadline())) {
            throw new IllegalArgumentException("Cannot apply: The deadline for this internship has passed.");
        }

        if (repository.existsByStudent_StudentNumberAndInternship_InternshipId(studentNumber, internshipId)) {
            throw new IllegalArgumentException("You have already applied for this internship.");
        }

        Application application = ApplicationFactory.createApplication("Pending", student, internship);
        return repository.save(application);
    }

    public Optional<Application> read(String applicationId) {
        return repository.findById(applicationId);
    }

    public boolean isStudentOwner(String studentNumber, String email) {
        return studentRepository.findById(studentNumber)
                .map(student -> student.getEmail().equalsIgnoreCase(email))
                .orElse(false);
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

    public List<Application> readByCompany(String companyId) {
        return repository.findByInternship_CompanyId(companyId);
    }

    public List<Application> readByStatus(String status) {
        return repository.findByStatus(status);
    }

    public Application updateStatus(String applicationId, String newStatus) {
        Application existing = repository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        Application updated = new Application.Builder()
                .copy(existing)
                .setStatus(newStatus)
                .build();

        return repository.save(updated);
    }

    public void delete(String applicationId) {
        if (!repository.existsById(applicationId)) {
            throw new IllegalArgumentException("Application not found");
        }
        repository.deleteById(applicationId);
    }
}