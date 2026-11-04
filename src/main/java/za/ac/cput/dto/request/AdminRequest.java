package za.ac.cput.dto.request;

/*
 * AdminRequest.java
 * Request DTO for creating or updating Admin accounts
 * Author: Magdeline Malahlela (240281721)
 * Date: October 2026
 */
public record AdminRequest(
        String name,
        String email,
        String password
) {}