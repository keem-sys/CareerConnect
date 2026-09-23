package za.ac.cput.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Student;
import za.ac.cput.service.ApplicationService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(ApplicationController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ApplicationService applicationService;

    @Autowired
    private ObjectMapper objectMapper;

    private Student student;
    private Internship internship;
    private Application application;

    @BeforeEach
    void setUp() {
        student = new Student.Builder()
                .setStudentNumber("ST-2026-001")
                .build();

        internship = new Internship.Builder()
                .setInternshipId("INT-001")
                .setDeadline(LocalDateTime.now().plusDays(7))
                .build();

        application = new Application.Builder()
                .setApplicationId("APP-001")
                .setStatus("Pending")
                .setStudent(student)
                .setInternship(internship)
                .build();
    }

    @Test
    void create_Success() throws Exception {
        when(applicationService.apply(any(Student.class), any(Internship.class))).thenReturn(application);

        mockMvc.perform(post("/api/application/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(application)))
                .andExpect(status().isCreated());

        verify(applicationService, times(1)).apply(any(Student.class), any(Internship.class));
    }

    @Test
    void read_Success() throws Exception {
        when(applicationService.read(anyString())).thenReturn(Optional.of(application));

        mockMvc.perform(get("/api/application/read/" + application.getApplicationId()))
                .andExpect(status().isOk());

        verify(applicationService, times(1)).read(anyString());
    }

    @Test
    void updateStatus_Success() throws Exception {
        when(applicationService.updateStatus(anyString(), anyString())).thenReturn(application);

        mockMvc.perform(put("/api/application/update/" + application.getApplicationId())
                        .param("status", "Accepted"))
                .andExpect(status().isOk());

        verify(applicationService, times(1)).updateStatus(anyString(), anyString());
    }

    @Test
    void delete_Success() throws Exception {
        doNothing().when(applicationService).delete(anyString());

        mockMvc.perform(delete("/api/application/delete/" + application.getApplicationId()))
                .andExpect(status().isNoContent());

        verify(applicationService, times(1)).delete(anyString());
    }

    @Test
    void getAll_Success() throws Exception {
        when(applicationService.readAll()).thenReturn(List.of(application));

        mockMvc.perform(get("/api/application/getAll"))
                .andExpect(status().isOk());

        verify(applicationService, times(1)).readAll();
    }

    @Test
    void getByStudent_Success() throws Exception {
        when(applicationService.readByStudent(anyString())).thenReturn(List.of(application));

        mockMvc.perform(get("/api/application/student/" + student.getStudentNumber()))
                .andExpect(status().isOk());

        verify(applicationService, times(1)).readByStudent(anyString());
    }

    @Test
    void getByInternship_Success() throws Exception {
        when(applicationService.readByInternship(anyString())).thenReturn(List.of(application));

        mockMvc.perform(get("/api/application/internship/" + internship.getInternshipId()))
                .andExpect(status().isOk());

        verify(applicationService, times(1)).readByInternship(anyString());
    }

    @Test
    void getByStatus_Success() throws Exception {
        when(applicationService.readByStatus(anyString())).thenReturn(List.of(application));

        mockMvc.perform(get("/api/application/status/" + application.getStatus()))
                .andExpect(status().isOk());

        verify(applicationService, times(1)).readByStatus(anyString());
    }
}
