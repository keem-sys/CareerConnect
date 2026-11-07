package za.ac.cput.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Company;
import za.ac.cput.domain.WorkMode;
import za.ac.cput.dto.request.InternshipSearchCriteria;
import za.ac.cput.dto.response.InternshipResponse;
import za.ac.cput.repository.ApplicationRepository;
import za.ac.cput.repository.CompanyRepository;
import za.ac.cput.repository.InternshipRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/*

* InternshipServiceTest.java
* Internship service test class
* Author: Refilwe Mabena (231013051)
* Date: 8 August 2026
  */

@ExtendWith(MockitoExtension.class)
public class InternshipServiceTest {

@Mock
private InternshipRepository internshipRepository;

@Mock
private CompanyRepository companyRepository;

@Mock
private ApplicationRepository applicationRepository;

@InjectMocks
private InternshipService internshipService;

private Internship internship;

@BeforeEach
void setUp() {
    internship = new Internship.Builder()
            .setInternshipId("INT001")
            .setCompanyId("COMP-001")
            .setTitle("Software Developer Intern")
            .setDescription("Java development internship")
            .setLocation("Cape Town")
            .setDeadline(LocalDateTime.now().plusDays(30))
            .build();
}

@Test
void create_Success() {
    when(internshipRepository.existsById(anyString())).thenReturn(false);
    when(internshipRepository.save(any(Internship.class))).thenReturn(internship);

    Internship createdInternship = internshipService.create(internship);

    assertNotNull(createdInternship);
    assertEquals("INT001", createdInternship.getInternshipId());
    assertEquals("Software Developer Intern", createdInternship.getTitle());

    verify(internshipRepository, times(1)).save(internship);
}

@Test
void create_FailsWhenDeadlineIsInThePast() {
    Internship expiredInternship = new Internship.Builder()
            .setInternshipId("INT002")
            .setCompanyId("COMP-001")
            .setTitle("Expired Internship")
            .setDescription("Internship with expired deadline")
            .setLocation("Cape Town")
            .setDeadline(LocalDateTime.now().minusDays(1))
            .build();

    Internship result = internshipService.create(expiredInternship);

    assertNull(result);

    verify(internshipRepository, never()).save(any(Internship.class));
}

@Test
void create_FailsWhenInternshipIdAlreadyExists() {
    when(internshipRepository.existsById(anyString())).thenReturn(true);

    Internship result = internshipService.create(internship);

    assertNull(result);

    verify(internshipRepository, never()).save(any(Internship.class));
}

@Test
void read_Success() {
    when(internshipRepository.findById(anyString()))
            .thenReturn(Optional.of(internship));

    Internship read = internshipService.read(internship.getInternshipId());

    assertNotNull(read);
    assertEquals("INT001", read.getInternshipId());
    assertEquals("Software Developer Intern", read.getTitle());
}

@Test
void read_NotFound() {
    when(internshipRepository.findById(anyString()))
            .thenReturn(Optional.empty());

    Internship read = internshipService.read("INVALID");

    assertNull(read);
}

@Test
void update_Success() {
    Internship updatedInternship = new Internship.Builder()
            .copy(internship)
            .setTitle("Senior Software Developer Intern")
            .build();

    when(internshipRepository.existsById(anyString())).thenReturn(true);
    when(internshipRepository.save(any(Internship.class)))
            .thenReturn(updatedInternship);

    Internship updatedResult = internshipService.update(updatedInternship);

    assertNotNull(updatedResult);
    assertEquals("Senior Software Developer Intern",
            updatedResult.getTitle());
}

@Test
void update_NotFound() {
    when(internshipRepository.existsById(anyString())).thenReturn(false);

    Internship result = internshipService.update(internship);

    assertNull(result);

    verify(internshipRepository, never()).save(any(Internship.class));
}

@Test
void delete_Success() {
    when(internshipRepository.existsById(anyString())).thenReturn(true);

    boolean deleted =
            internshipService.delete(internship.getInternshipId());

    assertTrue(deleted);

    verify(internshipRepository, times(1))
            .deleteById(internship.getInternshipId());
}

@Test
void delete_NotFound() {
    when(internshipRepository.existsById(anyString())).thenReturn(false);

    boolean deleted = internshipService.delete("INVALID");

    assertFalse(deleted);

    verify(internshipRepository, never()).deleteById(anyString());
}

@Test
void getAll_Success() {
    List<Internship> mockList = Arrays.asList(internship, internship);

    when(internshipRepository.findAll()).thenReturn(mockList);

    List<Internship> all = internshipService.getAll();

    assertNotNull(all);
    assertEquals(2, all.size());
}

@Test
void getInternshipsByLocation_Success() {
    List<Internship> mockList = Arrays.asList(internship);

    when(internshipRepository.findByLocation(anyString()))
            .thenReturn(mockList);

    List<Internship> internships =
            internshipService.getInternshipsByLocation("Cape Town");

    assertNotNull(internships);
    assertEquals(1, internships.size());
    assertEquals("Cape Town",
            internships.get(0).getLocation());
}

@Test
void getInternshipsByTitle_Success() {
    List<Internship> mockList = Arrays.asList(internship);

    when(internshipRepository.findByTitleContainingIgnoreCase(anyString()))
            .thenReturn(mockList);

    List<Internship> internships =
            internshipService.getInternshipsByTitle("Software");

    assertNotNull(internships);
    assertEquals(1, internships.size());
    assertEquals("Software Developer Intern",
            internships.get(0).getTitle());
}

@Test
void getUpcomingInternships_Success() {
    List<Internship> mockList = Arrays.asList(internship);

    when(internshipRepository.findByDeadlineAfter(any(LocalDateTime.class)))
            .thenReturn(mockList);

    List<Internship> internships =
            internshipService.getUpcomingInternships(LocalDateTime.now());

    assertNotNull(internships);
    assertEquals(1, internships.size());
    assertEquals("INT001",
            internships.get(0).getInternshipId());
}

@Test
void create_SetsCreatedAtAndDefaultPositions() {
    when(internshipRepository.existsById(anyString())).thenReturn(false);
    when(internshipRepository.save(any(Internship.class))).thenAnswer(inv -> inv.getArgument(0));

    Internship created = internshipService.create(internship);

    assertNotNull(created.getCreatedAt());
    assertEquals(1, created.getPositions());
}

@Test
void create_FailsWhenCompanyMissing() {
    Internship noCompany = new Internship.Builder().copy(internship).setCompanyId(null).build();

    assertNull(internshipService.create(noCompany));
    verify(internshipRepository, never()).save(any(Internship.class));
}

@Test
void search_FiltersByKeywordWorkModeAndPaid() {
    Internship java = new Internship.Builder().copy(internship)
            .setWorkMode(WorkMode.HYBRID).setStipend(6000)
            .setRequiredSkills(List.of("Java", "Spring Boot")).build();
    Internship design = new Internship.Builder().copy(internship)
            .setInternshipId("INT003").setTitle("UX Design Intern").setDescription("Figma work")
            .setWorkMode(WorkMode.REMOTE).setStipend(0).setRequiredSkills(List.of("Figma")).build();
    Company company = new Company.Builder().setCompanyId("COMP-001").setName("Takealot").setIndustry("E-commerce").build();

    when(internshipRepository.findAll()).thenReturn(List.of(java, design));
    when(companyRepository.findAll()).thenReturn(List.of(company));
    when(applicationRepository.findAll()).thenReturn(List.of());

    List<InternshipResponse> bySkill = internshipService.search(
            new InternshipSearchCriteria("spring", null, null, null, false, false, null, null));
    assertEquals(1, bySkill.size());
    assertEquals("Takealot", bySkill.get(0).companyName());

    List<InternshipResponse> paidHybrid = internshipService.search(
            new InternshipSearchCriteria(null, "cape", WorkMode.HYBRID, null, true, true, "stipend", null));
    assertEquals(1, paidHybrid.size());
    assertEquals("INT001", paidHybrid.get(0).internshipId());

    List<InternshipResponse> byCompany = internshipService.search(
            new InternshipSearchCriteria("takealot", null, null, null, false, false, null, 1));
    assertEquals(1, byCompany.size());
}

}