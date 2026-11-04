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
import za.ac.cput.domain.Internship;
import za.ac.cput.repository.CompanyRepository;
import za.ac.cput.repository.InternshipRepository;
import za.ac.cput.service.IInternshipService;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/*

* InternshipControllerTest.java
* Internship controller test class
* Author: Refilwe Mabena (231013051)
* Date: 8 August 2026
  */

@WebMvcTest(InternshipController.class)
@AutoConfigureMockMvc(addFilters = false)
public class InternshipControllerTest {

    @MockitoBean
    private za.ac.cput.service.JwtService jwtService;

    @MockitoBean
    private za.ac.cput.security.CustomUserDetailsService customUserDetailsService;

@Autowired
private MockMvc mockMvc;

@MockitoBean
private IInternshipService internshipService;

@MockitoBean
private InternshipRepository internshipRepository;

@MockitoBean
private CompanyRepository companyRepository;

@Autowired
private ObjectMapper objectMapper;

private Internship internship;

@BeforeEach
void setUp() {
    internship = new Internship.Builder()
            .setInternshipId("INT001")
            .setTitle("Software Developer Intern")
            .setDescription("Java development internship")
            .setLocation("Cape Town")
            .setDeadline(LocalDateTime.now().plusDays(30))
            .build();
}

@Test
void create_Success() throws Exception {
    when(internshipService.create(any(Internship.class)))
            .thenReturn(internship);

    mockMvc.perform(post("/api/internship/create")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(internship)))
            .andExpect(status().isCreated());

    verify(internshipService, times(1))
            .create(any(Internship.class));
}

@Test
void read_Success() throws Exception {
    when(internshipService.read(anyString()))
            .thenReturn(internship);

    mockMvc.perform(get("/api/internship/read/"
                    + internship.getInternshipId()))
            .andExpect(status().isOk());

    verify(internshipService, times(1))
            .read(anyString());
}

@Test
void update_Success() throws Exception {
    when(internshipService.read(anyString())).thenReturn(internship);
        when(internshipService.update(any(Internship.class)))
            .thenReturn(internship);

    mockMvc.perform(put("/api/internship/update")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(internship)))
            .andExpect(status().isOk());

    verify(internshipService, times(1))
            .update(any(Internship.class));
}

@Test
void delete_Success() throws Exception {
    when(internshipService.delete(anyString()))
            .thenReturn(true);

    mockMvc.perform(delete("/api/internship/delete/"
                    + internship.getInternshipId()))
            .andExpect(status().isOk());

    verify(internshipService, times(1))
            .delete(anyString());
}

@Test
void getAll_Success() throws Exception {
    when(internshipService.getAll())
            .thenReturn(List.of(internship));

    mockMvc.perform(get("/api/internship/getAll"))
            .andExpect(status().isOk());

    verify(internshipService, times(1))
            .getAll();
}

@Test
void getByLocation_Success() throws Exception {
    when(internshipService.getInternshipsByLocation(anyString()))
            .thenReturn(List.of(internship));

    mockMvc.perform(get("/api/internship/getByLocation")
                    .param("location", internship.getLocation()))
            .andExpect(status().isOk());

    verify(internshipService, times(1))
            .getInternshipsByLocation(anyString());
}

@Test
void getByTitle_Success() throws Exception {
    when(internshipService.getInternshipsByTitle(anyString()))
            .thenReturn(List.of(internship));

    mockMvc.perform(get("/api/internship/getByTitle")
                    .param("title", internship.getTitle()))
            .andExpect(status().isOk());

    verify(internshipService, times(1))
            .getInternshipsByTitle(anyString());
}

@Test
void create_ReturnsBadRequestWhenInvalid() throws Exception {
    when(internshipService.create(any(Internship.class))).thenReturn(null);

    mockMvc.perform(post("/api/internship/create")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(internship)))
            .andExpect(status().isBadRequest());
}

@Test
void search_PassesFiltersToService() throws Exception {
    when(internshipService.search(any())).thenReturn(List.of());

    mockMvc.perform(get("/api/internship/search")
                    .param("q", "java")
                    .param("workMode", "HYBRID")
                    .param("paidOnly", "true"))
            .andExpect(status().isOk());

    verify(internshipService, times(1)).search(argThat(c ->
            "java".equals(c.q()) && c.workMode() == za.ac.cput.domain.WorkMode.HYBRID && c.paidOnly()));
}

}