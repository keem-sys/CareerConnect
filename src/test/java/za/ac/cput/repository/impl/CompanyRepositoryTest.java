package za.ac.cput.repository.impl;

import za.ac.cput.domain.Company;
import za.ac.cput.factory.CompanyFactory;
import org.junit.jupiter.api.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/*
 * CompanyRepositoryTest.java
 * Test class for CompanyRepository
 * Author: Sylvia Mahlangu (222954396)
 * Date: 24 March 2026
 */

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CompanyRepositoryTest {

    private static final CompanyRepository repository = CompanyRepository.getRepository();

    private static final Company company = CompanyFactory.createCompany(
            "C001", "CareerConnect", "Technology", "222954396@mycput.ac.za"
    );

    @Test
    @Order(1)
    void create() {
        Company created = repository.create(company);
        assertNotNull(created);
        assertEquals(company.getCompanyId(), created.getCompanyId());
        System.out.println("Created: " + created);
    }

    @Test
    @Order(2)
    void read() {
        Company read = repository.read(company.getCompanyId());
        assertNotNull(read);
        System.out.println("Read: " + read);
    }

    @Test
    @Order(3)
    void update() {
        Company updatedCompany = new Company.Builder()
                .copy(company)
                .setName("CareerConnect Global")
                .build();

        Company updated = repository.update(updatedCompany);
        assertNotNull(updated);
        assertEquals("CareerConnect Global", updated.getName());
        System.out.println("Updated: " + updated);
    }

    @Test
    @Order(4)
    void getAll() {
        List<Company> companies = repository.getAll();
        assertFalse(companies.isEmpty());
        System.out.println("All Companies: " + companies);
    }

    @Test
    @Order(5)
    void delete() {
        boolean success = repository.delete(company.getCompanyId());
        assertTrue(success);
        assertNull(repository.read(company.getCompanyId()));
        System.out.println("Deleted successfully");
    }
}