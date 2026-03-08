package za.ac.cput.repository.impl;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.domain.Student;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNull;

/*
 * StudentRepositoryTest.java
 * Student repository test class
 * Author: Ebenezer Kouakou (230480152)
 * Date: 08 March 2026
 */
@TestMethodOrder(MethodOrderer.MethodName.class)
class StudentRepositoryTest {

    private static final StudentRepository repository = StudentRepository.getRepository();
    private static final Student student = new Student.Builder()
            .setStudentNumber("230480152")
            .setName("Ebenezer")
            .setEmail("eben@cput.ac.za")
            .setPassword("1234")
            .build();

    @Test
    void a_create() {
        Student created = repository.create(student);
        assertNotNull(created);
        System.out.println("Created: " + created);
    }

    @Test
    void b_read() {
        Student read = repository.read(student.getStudentNumber());
        assertNotNull(read);
        assertEquals("230480152", read.getStudentNumber());
        System.out.println("Read: " + read);
    }

    @Test
    void c_update() {
        Student updated = new Student.Builder().copy(student)
                .setName("Thandi")
                .build();

        assertNotNull(repository.update(updated));
        assertEquals("Thandi", repository.read("230480152").getName());
        System.out.println("Updated: " + repository.read("230480152"));
    }

    @Test
    void d_delete() {
        boolean success = repository.delete(student.getStudentNumber());
        assertTrue(success);
        assertNull(repository.read(student.getStudentNumber()));
        System.out.println("Student deleted successfully");
    }

    @Test
    void e_getAll() {
        repository.create(new Student.Builder()
                .setStudentNumber("230480152")
                .setName("Thandi Nloka")
                .setEmail("thandi@cput.ac.za")
                .setPassword("5678")
                .build());
        repository.create(new Student.Builder()
                .setStudentNumber("221045721")
                .setName("Koli Mnada")
                .setEmail("koli@cput.ac.za")
                .setPassword("9101112")
                .build());

        List<Student> allStudents = repository.getAll();
        assertNotNull(allStudents);
        assertTrue(allStudents.size() >= 2);
        System.out.println("All Students: " + allStudents);
    }
}


