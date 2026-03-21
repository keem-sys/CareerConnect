package za.ac.cput.repository.impl;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.domain.Admin;
import za.ac.cput.factory.AdminFactory;
import za.ac.cput.repository.impl.AdminRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/*
 *  AdminRepositoryImplTest.java
 * Test class for ProfileRepositoryImpl
 * Author:  Magdeline Malahlela (240281721)
 * Date: 21 March 2026
 */

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AdminRepositoryTest {

    private static final AdminRepository repository = AdminRepository.getRepository();

    private static final Admin admin = AdminFactory.createAdmin(
            "A001",
            "Magdeline",
            "admin@gmail.com",
            "pass123"
    );

    @Test
    @Order(1)
    void create() {
        Admin created = repository.create(admin);
        assertNotNull(created);
        System.out.println("Created: " + created);
    }

    @Test
    @Order(2)
    void read() {
        Admin read = repository.read(admin.getAdminId());
        assertNotNull(read);
        assertEquals("A001", read.getAdminId());
        System.out.println("Read: " + read);
    }

    @Test
    @Order(3)
    void update() {
        Admin updated = new Admin.Builder()
                .copy(admin)
                .setName("Updated Magdeline")
                .build();

        Admin result = repository.update(updated);
        assertNotNull(result);
        assertEquals("Updated Magdeline", result.getName());
        System.out.println("Updated: " + result);
    }

    @Test
    @Order(4)
    void getAll() {
        List<Admin> admins = repository.getAll();
        assertFalse(admins.isEmpty());
        System.out.println("All Admins: " + admins);
    }

    @Test
    @Order(5)
    void delete() {
        boolean deleted = repository.delete(admin.getAdminId());
        assertTrue(deleted);
        assertNull(repository.read(admin.getAdminId()));
        System.out.println("Deleted successfully");
    }
}