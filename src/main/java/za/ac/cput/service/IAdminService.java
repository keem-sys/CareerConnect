package za.ac.cput.service;

import za.ac.cput.dto.request.AdminRequest;
import za.ac.cput.dto.response.AdminResponse;

import java.util.List;
import java.util.Optional;

/*
 * IAdminService.java
 * Service Interface for Admin management operations
 * Author: Magdeline Malahlela (240281721)
 * Date: October 2026
 */
public interface IAdminService {
    AdminResponse create(AdminRequest request);
    AdminResponse read(String adminId);
    AdminResponse update(String adminId, AdminRequest request);
    boolean delete(String adminId);
    List<AdminResponse> getAll();
    Optional<AdminResponse> getByEmail(String email);
}