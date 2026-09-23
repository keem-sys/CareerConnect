package za.ac.cput.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Student;
import za.ac.cput.repository.ApplicationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository repository;

    @InjectMocks
    private ApplicationService applicationService;

    private Student student;
    private Internship futureInternship;
    private Internship pastInternship;
    private Application existingApplication;

    @BeforeEach
    void setUp() {
        student = new Student.Builder()
                .setStudentNumber("ST-2026-001")
                .build();

        futureInternship = new Internship.Builder()
                .setInternshipId("INT-001")
                .setDeadline(LocalDateTime.now().plusDays(7))
                .build();

        pastInternship = new Internship.Builder()
                .setInternshipId("INT-002")
                .setDeadline(LocalDateTime.now().minusDays(1))
                .build();

        existingApplication = new Application.Builder()
                .setApplicationId("APP-001")
                .setStatus("Pending")
                .setStudent(student)
                .setInternship(futureInternship)
                .build();
    }

    @Test
    void apply_ShouldSaveApplication_WhenValid() {
        when(repository.existsByStudent_StudentNumberAndInternship_InternshipId(
                student.getStudentNumber(), futureInternship.getInternshipId()))
                .thenReturn(false);
        when(repository.save(any(Application.class))).thenReturn(existingApplication);

        Application result = applicationService.apply(student, futureInternship);

        assertNotNull(result);
        assertEquals("Pending", result.getStatus());
        verify(repository, times(1)).save(any(Application.class));
    }

    @Test
    void apply_ShouldThrow_WhenDeadlineHasPassed() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> applicationService.apply(student, pastInternship)
        );

        assertEquals("Cannot apply for internship after the deadline.", exception.getMessage());
        verify(repository, never()).save(any(Application.class));
    }

    @Test
    void apply_ShouldThrow_WhenDuplicateApplicationExists() {
        when(repository.existsByStudent_StudentNumberAndInternship_InternshipId(
                student.getStudentNumber(), futureInternship.getInternshipId()))
                .thenReturn(true);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> applicationService.apply(student, futureInternship)
        );

        assertEquals("Student has already applied for this internship.", exception.getMessage());
        verify(repository, never()).save(any(Application.class));
    }

    @Test
    void read_ShouldReturnApplication_WhenExists() {
        when(repository.findById("APP-001")).thenReturn(Optional.of(existingApplication));

        Optional<Application> result = applicationService.read("APP-001");

        assertTrue(result.isPresent());
        assertEquals("APP-001", result.get().getApplicationId());
    }

    @Test
    void read_ShouldReturnEmpty_WhenNotFound() {
        when(repository.findById("APP-999")).thenReturn(Optional.empty());

        Optional<Application> result = applicationService.read("APP-999");

        assertTrue(result.isEmpty());
    }

    @Test
    void readAll_ShouldReturnAllApplications() {
        when(repository.findAll()).thenReturn(List.of(existingApplication));

        List<Application> result = applicationService.readAll();

        assertEquals(1, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void readByStudent_ShouldReturnApplicationsForThatStudent() {
        when(repository.findByStudent_StudentNumber("ST-2026-001"))
                .thenReturn(List.of(existingApplication));

        List<Application> result = applicationService.readByStudent("ST-2026-001");

        assertEquals(1, result.size());
        assertEquals("ST-2026-001", result.get(0).getStudent().getStudentNumber());
    }

    @Test
    void readByInternship_ShouldReturnApplicationsForThatInternship() {
        when(repository.findByInternship_InternshipId("INT-001"))
                .thenReturn(List.of(existingApplication));

        List<Application> result = applicationService.readByInternship("INT-001");

        assertEquals(1, result.size());
        assertEquals("INT-001", result.get(0).getInternship().getInternshipId());
    }

    @Test
    void readByStatus_ShouldReturnApplicationsWithThatStatus() {
        when(repository.findByStatus("Pending")).thenReturn(List.of(existingApplication));

        List<Application> result = applicationService.readByStatus("Pending");

        assertEquals(1, result.size());
        assertEquals("Pending", result.get(0).getStatus());
    }


    @Test
    void updateStatus_ShouldUpdateAndSave_WhenApplicationExists() {
        when(repository.findById("APP-001")).thenReturn(Optional.of(existingApplication));
        when(repository.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Application result = applicationService.updateStatus("APP-001", "Accepted");

        assertEquals("Accepted", result.getStatus());
        verify(repository, times(1)).save(any(Application.class));
    }

    @Test
    void updateStatus_ShouldThrow_WhenApplicationNotFound() {
        when(repository.findById("APP-999")).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> applicationService.updateStatus("APP-999", "Accepted")
        );

        assertEquals("Application not found", exception.getMessage());
        verify(repository, never()).save(any(Application.class));
    }

    @Test
    void delete_ShouldDeleteApplication_WhenExists() {
        when(repository.existsById("APP-001")).thenReturn(true);

        assertDoesNotThrow(() -> applicationService.delete("APP-001"));

        verify(repository, times(1)).deleteById("APP-001");
    }

    @Test
    void delete_ShouldThrow_WhenApplicationNotFound() {
        when(repository.existsById("APP-999")).thenReturn(false);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> applicationService.delete("APP-999")
        );

        assertEquals("Application not found", exception.getMessage());
        verify(repository, never()).deleteById(anyString());
    }
}