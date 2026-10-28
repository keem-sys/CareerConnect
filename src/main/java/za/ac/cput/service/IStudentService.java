package za.ac.cput.service;

import za.ac.cput.dto.request.StudentRegistrationRequest;
import za.ac.cput.dto.request.StudentUpdateRequest;
import za.ac.cput.dto.response.StudentResponse;

import java.util.List;
import java.util.Optional;

public interface IStudentService {
    StudentResponse create(StudentRegistrationRequest request);
    StudentResponse read(String studentNumber);
    StudentResponse update(String studentNumber, StudentUpdateRequest request);
    boolean delete(String studentNumber);
    List<StudentResponse> getAll();
    Optional<StudentResponse> getStudentByEmail(String email);
    List<StudentResponse> getStudentsByName(String name);
}