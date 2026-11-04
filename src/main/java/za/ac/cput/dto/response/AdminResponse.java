package za.ac.cput.dto.response;

/*
 * AdminResponse.java
 * Safe Admin DTO to return admin information without leaking passwords
 * Author: Magdeline Malahlela (240281721)
 * Date: October 2026
 */
public record AdminResponse(
        String adminId,
        String name,
        String email
) {}