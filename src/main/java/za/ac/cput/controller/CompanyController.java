package za.ac.cput.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Company;
import za.ac.cput.service.ICompanyService;

import java.util.List;

/*
 * CompanyController.java
 * Author: Sylvia Mahlangu (222954396)
 * Date: 19 October 2026
 */
@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "http://localhost:5173")
public class CompanyController {

    private final ICompanyService companyService;

    public CompanyController(ICompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Company company) {
        try {
            Company created = companyService.create(company);
            if (created == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Company registration failed. ID or email may already exist, or fields are invalid.");
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/read/{companyId}")
    public ResponseEntity<Company> read(@PathVariable String companyId) {
        Company company = companyService.read(companyId);
        if (company == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(company);
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('COMPANY', 'ADMIN')")
    public ResponseEntity<?> update(@RequestBody Company company) {
        Company updated = companyService.update(company);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Company not found or update failed.");
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{companyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String companyId) {
        boolean deleted = companyService.delete(companyId);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Company>> getAll() {
        return ResponseEntity.ok(companyService.getAll());
    }

    @GetMapping("/getByName")
    public ResponseEntity<List<Company>> getByName(@RequestParam String name) {
        return ResponseEntity.ok(companyService.getCompaniesByName(name));
    }

    @GetMapping("/getByIndustry")
    public ResponseEntity<List<Company>> getByIndustry(@RequestParam String industry) {
        return ResponseEntity.ok(companyService.getCompaniesByIndustry(industry));
    }
}