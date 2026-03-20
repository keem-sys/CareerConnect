
package za.ac.cput.factory;

import za.ac.cput.domain.Admin;

/*
 * AdminFactory.java
 * Admin factory class
 * Author: Magdeline Malahlela (240281721)
 * Date: 19 March 2026
 */

public class AdminFactory {

    public static Admin createAdmin(String adminId, String name, String email, String password) {
        if (isNullOrEmpty(adminId) || isNullOrEmpty(name) || isNullOrEmpty(email) || isNullOrEmpty(password)) {
            return null;
        }

        return new Admin.Builder()
                .setAdminId(adminId)
                .setName(name)
                .setEmail(email)
                .setPassword(password)
                .build();
    }

    private static boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
}