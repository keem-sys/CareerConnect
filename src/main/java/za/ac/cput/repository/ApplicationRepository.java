package za.ac.cput.repository;

/*
 * IApplicationRepository.java
 * IApplicationRepository class
 * Author: Mojalefa Mabotja (223227498)
 * Date: 21 March 2026
 */

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.Application;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {
    List<Application> findByStudent_StudentNumber(String studentNumber);
    List<Application> findByInternship_InternshipId(String internshipId);
    List<Application> findByStatus(String status);
    boolean existsByStudent_StudentNumberAndInternship_InternshipId(String studentNumber, String internshipId);
}
