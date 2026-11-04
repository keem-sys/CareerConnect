package za.ac.cput.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import za.ac.cput.domain.Student;
import za.ac.cput.dto.request.StudentRegistrationRequest;
import za.ac.cput.dto.request.StudentUpdateRequest;
import za.ac.cput.dto.response.StudentResponse;
import za.ac.cput.factory.StudentFactory;
import za.ac.cput.repository.StudentRepository;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/*
 * StudentServiceTest.java
 * Student service test class
 * Author: Ebenezer Kouakou (230480152)
 * Date: 17 October 2026
 */
@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    private Student student;

    @InjectMocks
    private StudentService studentService;

    @BeforeEach
    void setUp() {
        student = StudentFactory.buildStudent("230480152", "xholisa", "230480152@mycput.ac.za", "pass123");
    }

    @Test
    void create_Success() {
        when(passwordEncoder.encode("pass123")).thenReturn("hashed-pass123");
        when(studentRepository.existsById("230480152")).thenReturn(false);
        when(studentRepository.findByEmail("230480152@mycput.ac.za")).thenReturn(Optional.empty());
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentRegistrationRequest request = new StudentRegistrationRequest(
                "230480152", "xholisa", "pass123", "pass123"
        );

        StudentResponse response = studentService.create(request);
        assertNotNull(response);
        assertEquals("230480152", response.studentNumber());
        assertEquals("xholisa", response.name());
        assertEquals("230480152@mycput.ac.za", response.email());
        assertResponseHasNoPasswordField();
    }

    @Test
    void read_Success() {
        when(studentRepository.findById(student.getStudentNumber())).thenReturn(Optional.of(student));
        StudentResponse response = studentService.read(student.getStudentNumber());
        assertNotNull(response);
        assertEquals("xholisa", response.name());
        assertEquals("230480152", response.studentNumber());
        assertResponseHasNoPasswordField();
    }

    @Test
    void update_Success() {
        Student updatedStudent = new Student.Builder()
                .copy(student)
                .setName("Peter")
                .setEmail("peter@gmail.com")
                .build();

        when(studentRepository.findById("230480152")).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenReturn(updatedStudent);

        StudentUpdateRequest request = new StudentUpdateRequest("Peter", "peter@gmail.com");
        StudentResponse response = studentService.update("230480152", request);

        assertNotNull(response);
        assertEquals("Peter", response.name());
        assertEquals("peter@gmail.com", response.email());
        assertResponseHasNoPasswordField();
    }

    @Test
    void delete_Success() {
        when(studentRepository.existsById(student.getStudentNumber())).thenReturn(true);
        boolean deleted = studentService.delete(student.getStudentNumber());
        assertTrue(deleted);
        verify(studentRepository, times(1)).deleteById(student.getStudentNumber());
    }

    @Test
    void getAll_Success() {
        List<Student> mockList = Arrays.asList(student, student);
        when(studentRepository.findAll()).thenReturn(mockList);

        List<StudentResponse> all = studentService.getAll();
        assertNotNull(all);
        assertEquals(2, all.size());
        assertResponseHasNoPasswordField();
    }

    @Test
    void getStudentByEmail_Success() {
        when(studentRepository.findByEmail(student.getEmail())).thenReturn(Optional.of(student));
        Optional<StudentResponse> response = studentService.getStudentByEmail(student.getEmail());
        assertTrue(response.isPresent());
        assertEquals("230480152@mycput.ac.za", response.get().email());
        assertResponseHasNoPasswordField();
    }

    @Test
    void getStudentsByName_Success() {
        Student student1 = student;
        Student student2 = new Student.Builder()
                .copy(student)
                .setStudentNumber("230480999")
                .setEmail("230480999@mycput.ac.za")
                .build();

        List<Student> mockList = Arrays.asList(student1, student2);
        when(studentRepository.findByNameContainingIgnoreCase("xholisa")).thenReturn(mockList);

        List<StudentResponse> students = studentService.getStudentsByName("xholisa");

        assertNotNull(students);
        assertEquals(2, students.size());
        assertEquals("xholisa", students.get(0).name());
        assertEquals("xholisa", students.get(1).name());
        assertResponseHasNoPasswordField();
    }

    private void assertResponseHasNoPasswordField() {
        for (Field field : StudentResponse.class.getDeclaredFields()) {
            assertNotEquals("password", field.getName().toLowerCase(), "StudentResponse must never contain a password field");
        }
    }
}
