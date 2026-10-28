package za.ac.cput.dto.response;

/*
 * AuthResponse.java
 * Safe authentication response returning session/token details
 * Author: Ebenezer Kouakou (230480152)
 * Date: 18 October 2026
 */
public record AuthResponse(
        String token,
        String id,
        String name,
        String email,
        String role
) {}
