package za.ac.cput.controller;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Company;
import za.ac.cput.domain.Student;
import za.ac.cput.dto.response.DashboardStats.*;
import za.ac.cput.repository.CompanyRepository;
import za.ac.cput.repository.StudentRepository;
import za.ac.cput.service.StatsService;

import java.util.Objects;

/*
 * StatsController.java
 * Dashboard statistics for each role.
 */
@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {

    private final StatsService statsService;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;

    public StatsController(StatsService statsService,
                           StudentRepository studentRepository,
                           CompanyRepository companyRepository) {
        this.statsService = statsService;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
    }

    @GetMapping("/public")
    public PublicStats publicStats() {
        return statsService.publicStats();
    }

    @GetMapping("/student/{studentNumber}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public StudentStats studentStats(@PathVariable String studentNumber, Authentication authentication) {
        if (!isAdmin(authentication)) {
            String own = studentRepository.findByEmail(authentication.getName())
                    .map(Student::getStudentNumber).orElse(null);
            if (!studentNumber.equals(own)) {
                throw new AccessDeniedException("Access Denied: You may only view your own dashboard.");
            }
        }
        return statsService.studentStats(studentNumber);
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public CompanyStats companyStats(@PathVariable String companyId, Authentication authentication) {
        if (!isAdmin(authentication)) {
            String own = companyRepository.findByContactEmail(authentication.getName())
                    .map(Company::getCompanyId).orElse(null);
            if (!companyId.equals(own)) {
                throw new AccessDeniedException("Access Denied: You may only view your own dashboard.");
            }
        }
        return statsService.companyStats(companyId);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminStats adminStats() {
        return statsService.adminStats();
    }

    private static boolean isAdmin(Authentication authentication) {
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_ADMIN"));
    }
}