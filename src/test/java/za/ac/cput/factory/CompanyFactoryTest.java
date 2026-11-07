package za.ac.cput.factory;

import za.ac.cput.domain.Company;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/*
 * CompanyFactory.java
 * Company factory class
 * Author: Sylvia Mahlangu (222954396)
 * Date: 24 March 2026
 */

class CompanyFactoryTest {

    @Test
    void createCompany() {
        Company company = CompanyFactory.createCompany(
                "C001",
                "CareerConnect",
                "Technology",
                "222954396@mycput.ac.za",
                "securePass123"
        );

        assertNotNull(company);
        assertEquals("C001", company.getCompanyId());
        assertEquals("CareerConnect", company.getName());
    }

    @Test
    void createCompanyWithNullValues() {
        Company company = CompanyFactory.createCompany(
                null,
                "CareerConnect",
                "Technology",
                "222954396@mycput.ac.za",
                "securePass123"
        );

        assertNull(company);
    }

    @Test
    void createCompanyWithEmptyValues() {
        Company company = CompanyFactory.createCompany(
                "",
                "CareerConnect",
                "Technology",
                "222954396@mycput.ac.za",
                "securePass123"
        );

        assertNull(company);
    }
}