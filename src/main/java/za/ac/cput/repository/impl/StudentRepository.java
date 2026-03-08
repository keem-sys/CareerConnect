package za.ac.cput.repository.impl;

import za.ac.cput.domain.Student;
import za.ac.cput.repository.IStudentRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * StudentRepository.java
 * Student repository class
 * Author: Ebenezer Kouakou (230480152)
 * Date: 08 March 2026
 */
public class StudentRepository implements IStudentRepository {
    private static StudentRepository repository = null;
    private final Map<String, Student> studentMap;

    private StudentRepository() {
        this.studentMap = new HashMap<>();
    }

    public static StudentRepository getRepository() {
        if (repository == null) {
            repository = new StudentRepository();
        }
        return repository;
    }

    @Override
    public Student create(Student student) {
        studentMap.put(student.getStudentNumber(), student);
        return student;
    }

    @Override
    public Student read(String studentNumber) {
        return studentMap.get(studentNumber);
    }

    @Override
    public Student update(Student student) {
        if (studentMap.containsKey(student.getStudentNumber())) {
            studentMap.put(student.getStudentNumber(), student);
            return student;
        }
        return null;
    }

    @Override
    public boolean delete(String studentNumber) {
        if (studentMap.containsKey(studentNumber)) {
            studentMap.remove(studentNumber);
            return true;
        }
        return false;
    }

    @Override
    public List<Student> getAll() {
        return new ArrayList<>(studentMap.values());
    }
}
