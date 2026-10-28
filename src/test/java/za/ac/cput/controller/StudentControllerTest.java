package za.ac.cput.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;
import za.ac.cput.dto.request.StudentRegistrationRequest;
import za.ac.cput.dto.request.StudentUpdateRequest;
import za.ac.cput.dto.response.StudentResponse;
import za.ac.cput.service.IStudentService;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/*
 * StudentControllerTest.java
 * Student controller test class
 * Author: Ebenezer Kouakou (230480152)
 * Date: 17 October 2026
 */
@WebMvcTest(StudentController.class)
@AutoConfigureMockMvc(addFilters = false)
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IStudentService studentService;

    @Autowired
    private ObjectMapper objectMapper;

    private StudentResponse studentResponse;

    @BeforeEach
    void setUp() {
        studentResponse = new StudentResponse("230480152", "xholisa", "230480152@mycput.ac.za");
    }

    @Test
    void create_Success() throws Exception {
        StudentRegistrationRequest request = new StudentRegistrationRequest(
                "230480152", "xholisa", "pass123", "pass123"
        );

        when(studentService.create(any(StudentRegistrationRequest.class))).thenReturn(studentResponse);

        mockMvc.perform(post("/api/student/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.studentNumber").value("230480152"))
                .andExpect(jsonPath("$.name").value("xholisa"))
                .andExpect(jsonPath("$.email").value("230480152@mycput.ac.za"))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(studentService, times(1)).create(any(StudentRegistrationRequest.class));
    }

    @Test
    void read_Success() throws Exception {
        when(studentService.read("230480152")).thenReturn(studentResponse);

        mockMvc.perform(get("/api/student/read/230480152")
                        .principal(studentAuthentication()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentNumber").value("230480152"))
                .andExpect(jsonPath("$.name").value("xholisa"))
                .andExpect(jsonPath("$.email").value("230480152@mycput.ac.za"))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(studentService, times(1)).read("230480152");
    }

    @Test
    void update_Success() throws Exception {
        StudentUpdateRequest updateRequest = new StudentUpdateRequest("Peter", "peter@gmail.com");
        StudentResponse updatedResponse = new StudentResponse("230480152", "Peter", "peter@gmail.com");

        when(studentService.update(eq("230480152"), any(StudentUpdateRequest.class))).thenReturn(updatedResponse);

        mockMvc.perform(put("/api/student/update/230480152")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
                .principal(studentAuthentication()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentNumber").value("230480152"))
                .andExpect(jsonPath("$.name").value("Peter"))
                .andExpect(jsonPath("$.email").value("peter@gmail.com"))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(studentService, times(1)).update(eq("230480152"), any(StudentUpdateRequest.class));
    }

    @Test
    void delete_Success() throws Exception {
        when(studentService.delete("230480152")).thenReturn(true);

        mockMvc.perform(delete("/api/student/delete/230480152"))
                .andExpect(status().isNoContent());

        verify(studentService, times(1)).delete("230480152");
    }

    @Test
    void getAll_Success() throws Exception {
        when(studentService.getAll()).thenReturn(List.of(studentResponse));

        mockMvc.perform(get("/api/student/getAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentNumber").value("230480152"))
                .andExpect(jsonPath("$[0].name").value("xholisa"))
                .andExpect(jsonPath("$[0].email").value("230480152@mycput.ac.za"))
                .andExpect(jsonPath("$[0].password").doesNotExist());

        verify(studentService, times(1)).getAll();
    }

    @Test
    void getStudentByEmail_Success() throws Exception {
        when(studentService.getStudentByEmail("230480152@mycput.ac.za")).thenReturn(Optional.of(studentResponse));

        mockMvc.perform(get("/api/student/getByEmail")
                .param("email", "230480152@mycput.ac.za")
                .principal(studentAuthentication()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentNumber").value("230480152"))
                .andExpect(jsonPath("$.name").value("xholisa"))
                .andExpect(jsonPath("$.email").value("230480152@mycput.ac.za"))
                .andExpect(jsonPath("$.password").doesNotExist());

        verify(studentService, times(1)).getStudentByEmail("230480152@mycput.ac.za");
    }

    @Test
    void getStudentsByName_Success() throws Exception {
        when(studentService.getStudentsByName("xholisa")).thenReturn(List.of(studentResponse));

        mockMvc.perform(get("/api/student/getByName")
                .param("name", "xholisa"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentNumber").value("230480152"))
                .andExpect(jsonPath("$[0].name").value("xholisa"))
                .andExpect(jsonPath("$[0].email").value("230480152@mycput.ac.za"))
                .andExpect(jsonPath("$[0].password").doesNotExist());

        verify(studentService, times(1)).getStudentsByName("xholisa");
    }

    private UsernamePasswordAuthenticationToken studentAuthentication() {
        return new UsernamePasswordAuthenticationToken(
                "230480152@mycput.ac.za",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );
    }
}
