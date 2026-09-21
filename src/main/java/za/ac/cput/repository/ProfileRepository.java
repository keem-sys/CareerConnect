package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.Profile;

import java.util.Optional;

/*
 * IProfileRepository.java
 * IProfileRepository interface
 * Author: Oratilwe Komane (230716873)
 * Date: 11 September 2026
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {
    Optional<Profile> findByStudentNumber(String studentNumber);
}