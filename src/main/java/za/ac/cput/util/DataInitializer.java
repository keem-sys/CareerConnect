package za.ac.cput.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import za.ac.cput.domain.Admin;
import za.ac.cput.factory.AdminFactory;
import za.ac.cput.repository.AdminRepository;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String adminEmail = "admin@cput.ac.za";

        if (adminRepository.findByEmail(adminEmail).isEmpty()) {
            Admin systemAdmin = AdminFactory.createAdmin(
                    "ADM-001",
                    "CPUT WIL Coordinator",
                    adminEmail,
                    passwordEncoder.encode("adminpass123")
            );

            if (systemAdmin != null) {
                adminRepository.save(systemAdmin);
                System.out.println(">>> [CareerConnect] Default Admin seeded: " + adminEmail + " / Admin@2026");
            }
        }
    }
}