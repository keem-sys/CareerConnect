package za.ac.cput.repository.impl;

import za.ac.cput.domain.Admin;
import za.ac.cput.repository.IAdminRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * AdminRepositoryImpl.java
 * Admin repository implementation class
 * Author: Magdeline Malahlela (240281721)
 * Date: 21 March 2026
 */

public class AdminRepository implements IAdminRepository {

    private static AdminRepository repository = null;
    private Map<String, Admin> adminDB;

    private AdminRepository() {
        adminDB = new HashMap<>();
    }

    public static AdminRepository getRepository() {
        if (repository == null) {
            repository = new AdminRepository();
        }
        return repository;
    }

    @Override
    public Admin create(Admin admin) {
        if (admin == null || adminDB.containsKey(admin.getAdminId())) {
            return null;
        }
        adminDB.put(admin.getAdminId(), admin);
        return admin;
    }

    @Override
    public Admin read(String adminId) {
        return adminDB.get(adminId);
    }

    @Override
    public Admin update(Admin admin) {
        if (admin == null || !adminDB.containsKey(admin.getAdminId())) {
            return null;
        }
        adminDB.put(admin.getAdminId(), admin);
        return admin;
    }

    @Override
    public boolean delete(String adminId) {
        return adminDB.remove(adminId) != null;
    }

    @Override
    public List<Admin> getAll() {
        return new ArrayList<>(adminDB.values());
    }
}




