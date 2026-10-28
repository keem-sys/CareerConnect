package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.Internship;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, String> {
    List<Internship> findByCompanyId(String companyId);
    List<Internship> findByLocation(String location);
    List<Internship> findByTitleContainingIgnoreCase(String title);
    List<Internship> findByDeadlineAfter(LocalDateTime deadline);
}