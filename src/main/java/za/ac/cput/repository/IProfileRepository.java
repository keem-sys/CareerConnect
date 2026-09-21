package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.Profile;

import java.util.Optional;

/*
 * IProfileRepository.java
 * IProfileRepository interface
 * Author: Oratilwe Komane (230716873)
 * Date: 11 March 2026
 */
@Repository
public interface IProfileRepository extends JpaRepository<Profile, String> {
    Optional<Profile> findByStudentNumber(String studentNumber);
}