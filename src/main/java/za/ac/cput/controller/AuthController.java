package za.ac.cput.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.dto.request.LoginRequest;
import za.ac.cput.dto.response.AuthResponse;
import za.ac.cput.repository.AdminRepository;
import za.ac.cput.repository.CompanyRepository;
import za.ac.cput.repository.StudentRepository;
import za.ac.cput.service.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String identifier = request.identifier().trim();
        String password = request.password();

        var admin = adminRepository.findByEmail(identifier);
        if (admin.isPresent() && passwordEncoder.matches(password, admin.get().getPassword())) {
            String token = jwtService.generateToken(admin.get().getEmail(), "ADMIN", admin.get().getName());
            return ResponseEntity.ok(new AuthResponse(token, admin.get().getAdminId(), admin.get().getName(), admin.get().getEmail(), "ADMIN"));
        }

        String searchEmail = identifier.contains("@") ? identifier : identifier + "@mycput.ac.za";
        var student = studentRepository.findByEmail(searchEmail);
        if (student.isPresent() && passwordEncoder.matches(password, student.get().getPassword())) {
            String token = jwtService.generateToken(student.get().getEmail(), "STUDENT", student.get().getName());
            return ResponseEntity.ok(new AuthResponse(token, student.get().getStudentNumber(), student.get().getName(), student.get().getEmail(), "STUDENT"));
        }

        var company = companyRepository.findByContactEmail(identifier);
        if (company.isPresent() && passwordEncoder.matches(password, company.get().getPassword())) {
            String token = jwtService.generateToken(company.get().getContactEmail(), "COMPANY", company.get().getName());
            return ResponseEntity.ok(new AuthResponse(
                    token,
                    company.get().getCompanyId(),
                    company.get().getName(),
                    company.get().getContactEmail(),
                    "COMPANY"
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
    }
}