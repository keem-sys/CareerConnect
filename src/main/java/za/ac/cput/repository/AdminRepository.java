package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.Admin;

import java.util.Optional;

/*
 * AdminRepository.java
 * AdminRepository interface
 * Author: Ebenezer Kouakou (230480152)
 * Date: 18 October 2026
 */
@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByEmail(String email);
}
