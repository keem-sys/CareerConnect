package za.ac.cput.security;

import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.Admin;
import za.ac.cput.domain.Company;
import za.ac.cput.domain.Student;
import za.ac.cput.repository.AdminRepository;
import za.ac.cput.repository.CompanyRepository;
import za.ac.cput.repository.StudentRepository;

import java.util.Collections;
import java.util.Optional;

/*
 * CustomUserDetailsService.java
 * Multi-Role Dynamic Authentication Provider for Student, Company, and Admin
 * Author: Ebenezer Kouakou (230480152)
 * Date: 18 October 2026
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final AdminRepository adminRepository;

    public CustomUserDetailsService(
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            AdminRepository adminRepository
    ) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    @NullMarked
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String cleanIdentifier = identifier.trim();

        Optional<Admin> admin = adminRepository.findByEmail(cleanIdentifier);
        if (admin.isPresent()) {
            return new User(
                    admin.get().getEmail(),
                    admin.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        Optional<Company> company = companyRepository.findByContactEmail(cleanIdentifier);
        if (company.isPresent()) {
            return new User(
                    company.get().getContactEmail(),
                    company.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_COMPANY"))
            );
        }

        String searchEmail = cleanIdentifier.contains("@") ? cleanIdentifier : cleanIdentifier + "@mycput.ac.za";
        Optional<Student> student = studentRepository.findByEmail(searchEmail);
        if (student.isPresent()) {
            return new User(
                    student.get().getEmail(),
                    student.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT"))
            );
        }

        throw new UsernameNotFoundException("No user found with identifier: " + cleanIdentifier);
    }
}