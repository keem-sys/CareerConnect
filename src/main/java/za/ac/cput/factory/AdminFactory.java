package za.ac.cput.factory;

import za.ac.cput.domain.Admin;
import za.ac.cput.util.Helper;

import java.util.UUID;

/*
 * AdminFactory.java
 * Factory for creating verified Admin entities
 * Author: Magdeline Malahlela (240281721)
 * Date: 19 March 2026 (Updated: October 2026)
 */
public class AdminFactory {

    /**
     * Creates an Admin with a designated ID (e.g., from DB or system config)
     */
    public static Admin createAdmin(String adminId, String name, String email, String password) {
        if (Helper.isEmptyOrNull(adminId) || Helper.isEmptyOrNull(name) || Helper.isEmptyOrNull(password)) {
            return null;
        }

        if (!Helper.isValidEmail(email)) {
            return null;
        }

        return new Admin.Builder()
                .setAdminId(adminId)
                .setName(name)
                .setEmail(email)
                .setPassword(password)
                .build();
    }

    public static Admin createAdmin(String name, String email, String password) {
        String generatedAdminId = "ADM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return createAdmin(generatedAdminId, name, email, password);
    }
}