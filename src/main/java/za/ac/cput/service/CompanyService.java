package za.ac.cput.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.Company;
import za.ac.cput.factory.CompanyFactory;
import za.ac.cput.repository.CompanyRepository;

import java.util.List;
import java.util.Optional;

/*
 * CompanyService.java
 * Company Service Implementation with BCrypt Hashing & Factory Validation
 * Author: Sylvia Mahlangu (222954396)
 * Date: 19 October 2026
 */
@Service
public class CompanyService implements ICompanyService {

    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public CompanyService(CompanyRepository companyRepository, PasswordEncoder passwordEncoder) {
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Company create(Company company) {
        if (company == null) {
            return null;
        }

        String hashedPassword = passwordEncoder.encode(company.getPassword());

        Company validatedCompany = CompanyFactory.createCompany(
                company.getCompanyId().trim(),
                company.getName().trim(),
                company.getIndustry().trim(),
                company.getContactEmail().trim(),
                hashedPassword
        );

        if (validatedCompany == null) {
            System.out.println("Company Registration Failed: Missing or invalid fields caught by CompanyFactory.");
            return null;
        }

        if (companyRepository.existsById(validatedCompany.getCompanyId())) {
            System.out.println("Company Registration Failed: Company ID already exists.");
            return null;
        }

        if (companyRepository.findByContactEmail(validatedCompany.getContactEmail()).isPresent()) {
            System.out.println("Company Registration Failed: Contact email is already registered.");
            return null;
        }

        return companyRepository.save(validatedCompany);
    }

    @Override
    public Company read(String companyId) {
        return companyRepository.findById(companyId).orElse(null);
    }

    @Override
    public Company update(Company company) {
        if (company == null || !companyRepository.existsById(company.getCompanyId())) {
            return null;
        }

        Company existing = read(company.getCompanyId());
        String passwordToSave = company.getPassword();

        if (passwordToSave != null && !passwordToSave.startsWith("$2a$")) {
            passwordToSave = passwordEncoder.encode(passwordToSave);
        } else if (passwordToSave == null) {
            passwordToSave = existing.getPassword();
        }

        Company updatedCompany = new Company.Builder()
                .copy(company)
                .setPassword(passwordToSave)
                .build();

        return companyRepository.save(updatedCompany);
    }

    @Override
    public boolean delete(String companyId) {
        if (companyRepository.existsById(companyId)) {
            companyRepository.deleteById(companyId);
            return true;
        }
        return false;
    }

    @Override
    public List<Company> getAll() {
        return companyRepository.findAll();
    }

    @Override
    public Optional<Company> getCompanyByEmail(String contactEmail) {
        return companyRepository.findByContactEmail(contactEmail);
    }

    @Override
    public List<Company> getCompaniesByName(String name) {
        return companyRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Company> getCompaniesByIndustry(String industry) {
        return companyRepository.findByIndustryIgnoreCase(industry);
    }
}