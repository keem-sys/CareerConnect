package za.ac.cput.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import za.ac.cput.domain.Company;
import za.ac.cput.repository.CompanyRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CompanyService companyService;

    private Company company;

    @BeforeEach
    void setUp() {
        company = new Company.Builder()
                .setCompanyId("company-1")
                .setName("Career Connect")
                .setIndustry("Technology")
                .setContactEmail("contact@example.com")
                .setPassword("encoded-password")
                .build();
    }

    @Test
    void create() {
        when(passwordEncoder.encode("encoded-password")).thenReturn("$2a$hashed");
        when(companyRepository.save(any(Company.class))).thenAnswer(inv -> inv.getArgument(0));

        Company result = companyService.create(company);
        assertNotNull(result);
        assertEquals("company-1", result.getCompanyId());
        assertEquals("$2a$hashed", result.getPassword());
        verify(companyRepository).save(any(Company.class));
    }

    @Test
    void read() {
        when(companyRepository.findById("company-1")).thenReturn(Optional.of(company));

        assertSame(company, companyService.read("company-1"));
    }

    @Test
    void readMissingCompany() {
        when(companyRepository.findById("missing")).thenReturn(Optional.empty());

        assertNull(companyService.read("missing"));
    }

    @Test
    void update() {
        Company updated = new Company.Builder().copy(company).setName("Updated Company").build();
        when(companyRepository.existsById("company-1")).thenReturn(true);
        when(companyRepository.findById("company-1")).thenReturn(Optional.of(company));
        when(passwordEncoder.encode("encoded-password")).thenReturn("$2a$hashed");
        when(companyRepository.save(any(Company.class))).thenAnswer(inv -> inv.getArgument(0));

        Company result = companyService.update(updated);
        assertEquals("Updated Company", result.getName());
        assertEquals("$2a$hashed", result.getPassword());
        verify(companyRepository).save(any(Company.class));
    }

    @Test
    void updateMissingCompany() {
        when(companyRepository.existsById("company-1")).thenReturn(false);

        assertNull(companyService.update(company));
        verify(companyRepository, never()).save(any(Company.class));
    }

    @Test
    void delete() {
        when(companyRepository.existsById("company-1")).thenReturn(true);

        assertTrue(companyService.delete("company-1"));
        verify(companyRepository).deleteById("company-1");
    }

    @Test
    void deleteMissingCompany() {
        when(companyRepository.existsById("missing")).thenReturn(false);

        assertFalse(companyService.delete("missing"));
        verify(companyRepository, never()).deleteById(anyString());
    }

    @Test
    void getAll() {
        List<Company> companies = List.of(company);
        when(companyRepository.findAll()).thenReturn(companies);

        assertEquals(companies, companyService.getAll());
    }

    @Test
    void getAllWhenEmpty() {
        when(companyRepository.findAll()).thenReturn(List.of());

        assertTrue(companyService.getAll().isEmpty());
    }
}
