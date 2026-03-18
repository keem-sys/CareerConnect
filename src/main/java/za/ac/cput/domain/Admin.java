/*
 * Admin.java
 * Student entity class
 * Author: Magdeline Malahlela (240281721)
 * Date: 18 March 2026
 */

package za.ac.cput.domain;

import java.util.Objects;

public class Admin {

    private String adminId;
    private String name;
    private String email;
    private String password;

    // Private constructor
    private Admin(Builder builder) {
        this.adminId = builder.adminId;
        this.name = builder.name;
        this.email = builder.email;
        this.password = builder.password;
    }

    // Getters
    public String getAdminId() {
        return adminId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // toString
    @Override
    public String toString() {
        return "Admin{" +
                "adminId='" + adminId + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Admin admin = (Admin) o;
        return Objects.equals(adminId, admin.adminId) &&
                Objects.equals(email, admin.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(adminId, email);
    }

    public static class Builder {

        private String adminId;
        private String name;
        private String email;
        private String password;

        public Builder setAdminId(String adminId) {
            this.adminId = adminId;
            return this;
        }

        public Builder setName(String name) {
            this.name = name;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setPassword(String password) {
            this.password = password;
            return this;
        }

        public Admin build() {
            return new Admin(this);
        }
    }
}