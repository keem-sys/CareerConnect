package za.ac.cput.factory;

import za.ac.cput.domain.Admin;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/*
 * AdminFactoryTest.java
 * Test class for ProfileFactory
 * Author: Magdeline Malahlela (240281721)
 * Date: 19 March 2026
 */

class AdminFactoryTest {

    @Test
    void createAdmin() {
        Admin admin = AdminFactory.createAdmin("A001", "Magdeline", "admin@gmail.com", "pass123");

        assertNotNull(admin);
        assertEquals("A001", admin.getAdminId());
        assertEquals("Magdeline", admin.getName());
        assertEquals("admin@gmail.com", admin.getEmail());
        assertEquals("pass123", admin.getPassword());
        System.out.println(admin);
    }

    @Test
    void createAdminWithNullAdminId() {
        Admin admin = AdminFactory.createAdmin(null, "Magdeline", "admin@gmail.com", "pass123");
        assertNull(admin);
    }

    @Test
    void createAdminWithEmptyAdminId() {
        Admin admin = AdminFactory.createAdmin("", "Magdeline", "admin@gmail.com", "pass123");
        assertNull(admin);
    }

    @Test
    void createAdminWithNullName() {
        Admin admin = AdminFactory.createAdmin("A001", null, "admin@gmail.com", "pass123");
        assertNull(admin);
    }

    @Test
    void createAdminWithEmptyName() {
        Admin admin = AdminFactory.createAdmin("A001", "   ", "admin@gmail.com", "pass123");
        assertNull(admin);
    }

    @Test
    void createAdminWithNullEmail() {
        Admin admin = AdminFactory.createAdmin("A001", "Magdeline", null, "pass123");
        assertNull(admin);
    }

    @Test
    void createAdminWithEmptyEmail() {
        Admin admin = AdminFactory.createAdmin("A001", "Magdeline", "", "pass123");
        assertNull(admin);
    }

    @Test
    void createAdminWithNullPassword() {
        Admin admin = AdminFactory.createAdmin("A001", "Magdeline", "admin@gmail.com", null);
        assertNull(admin);
    }

    @Test
    void createAdminWithEmptyPassword() {
        Admin admin = AdminFactory.createAdmin("A001", "Magdeline", "admin@gmail.com", " ");
        assertNull(admin);
    }
}