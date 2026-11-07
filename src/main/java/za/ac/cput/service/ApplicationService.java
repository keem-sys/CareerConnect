package za.ac.cput.service;

import org.springframework.stereotype.Service;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.ApplicationStatus;
import za.ac.cput.domain.Company;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Student;
import za.ac.cput.dto.response.ApplicationResponse;
import za.ac.cput.factory.ApplicationFactory;
import za.ac.cput.repository.ApplicationRepository;
import za.ac.cput.repository.CompanyRepository;
import za.ac.cput.repository.InternshipRepository;
import za.ac.cput.repository.StudentRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository repository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;
    private final CompanyRepository companyRepository;

    public ApplicationService(ApplicationRepository repository,
                              StudentRepository studentRepository,
                              InternshipRepository internshipRepository,
                              CompanyRepository companyRepository) {
        this.repository = repository;
        this.studentRepository = studentRepository;
        this.internshipRepository = internshipRepository;
        this.companyRepository = companyRepository;
    }

    public Application apply(String studentNumber, String internshipId) {
        return apply(studentNumber, internshipId, null);
    }

    public Application apply(String studentNumber, String internshipId, String coverLetter) {
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

        Application application = ApplicationFactory.createApplication(student, internship, coverLetter);
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

    public List<Application> readByStatus(ApplicationStatus status) {
        return repository.findByStatus(status);
    }

    /**
     * Employer/admin moves an application through the hiring pipeline.
     * Only forward moves are allowed and withdrawing is reserved for the student.
     */
    public Application updateStatus(String applicationId, ApplicationStatus newStatus) {
        Application existing = repository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (newStatus == ApplicationStatus.WITHDRAWN) {
            throw new IllegalArgumentException("Only the student can withdraw an application.");
        }
        return transition(existing, newStatus);
    }

    public Application withdraw(String applicationId) {
        Application existing = repository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        return transition(existing, ApplicationStatus.WITHDRAWN);
    }

    private Application transition(Application existing, ApplicationStatus newStatus) {
        ApplicationStatus current = existing.getStatus() == null ? ApplicationStatus.PENDING : existing.getStatus();
        if (current == newStatus) {
            return existing;
        }
        if (!current.canTransitionTo(newStatus)) {
            throw new IllegalArgumentException(
                    "Cannot change an application from " + current + " to " + newStatus + ".");
        }

        Application updated = new Application.Builder()
                .copy(existing)
                .setStatus(newStatus)
                .setUpdatedAt(LocalDateTime.now())
                .build();

        return repository.save(updated);
    }

    public void delete(String applicationId) {
        if (!repository.existsById(applicationId)) {
            throw new IllegalArgumentException("Application not found");
        }
        repository.deleteById(applicationId);
    }

    public ApplicationResponse toResponse(Application application) {
        return toResponses(List.of(application)).get(0);
    }

    public List<ApplicationResponse> toResponses(List<Application> applications) {
        Map<String, String> names = new HashMap<>();
        return applications.stream()
                .map(a -> ApplicationResponse.from(a, companyId -> companyId == null ? null :
                        names.computeIfAbsent(companyId, id -> companyRepository == null ? null :
                                companyRepository.findById(id).map(Company::getName).orElse(null))))
                .toList();
    }
}