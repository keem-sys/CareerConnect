package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.Company;

import java.util.List;
import java.util.Optional;

/*
 * CompanyRepository.java
 * CompanyRepository interface
 * Author: Sylvia Mahlangu (222954396)
 * Date: 18 October 2026
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {
    Optional<Company> findByContactEmail(String contactEmail);
    List<Company> findByNameContainingIgnoreCase(String name);
    List<Company> findByIndustryIgnoreCase(String industry);
}
