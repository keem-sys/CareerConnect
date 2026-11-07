package za.ac.cput.service;

import org.springframework.stereotype.Service;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.ApplicationStatus;
import za.ac.cput.domain.Internship;
import za.ac.cput.domain.Profile;
import za.ac.cput.dto.response.DashboardStats.*;
import za.ac.cput.repository.*;

import java.util.*;

/*
 * StatsService.java
 * Aggregates dashboard figures for the public landing page, students, companies and admins.
 */
@Service
public class StatsService {

    private final ApplicationRepository applicationRepository;
    private final InternshipRepository internshipRepository;
    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;
    private final ProfileRepository profileRepository;

    public StatsService(ApplicationRepository applicationRepository,
                        InternshipRepository internshipRepository,
                        CompanyRepository companyRepository,
                        StudentRepository studentRepository,
                        ProfileRepository profileRepository) {
        this.applicationRepository = applicationRepository;
        this.internshipRepository = internshipRepository;
        this.companyRepository = companyRepository;
        this.studentRepository = studentRepository;
        this.profileRepository = profileRepository;
    }

    public PublicStats publicStats() {
        long open = internshipRepository.findAll().stream().filter(Internship::isOpen).count();
        long placements = applicationRepository.findByStatus(ApplicationStatus.ACCEPTED).size();
        return new PublicStats(open, companyRepository.count(), studentRepository.count(), placements);
    }

    public StudentStats studentStats(String studentNumber) {
        List<Application> apps = applicationRepository.findByStudent_StudentNumber(studentNumber);
        Map<String, Long> byStatus = countByStatus(apps);
        long active = apps.stream().filter(a -> a.getStatus() != null && !a.getStatus().isFinal()).count();
        long offers = byStatus.get(ApplicationStatus.ACCEPTED.name());

        List<String> missing = new ArrayList<>();
        Optional<Profile> profile = profileRepository.findByStudentNumber(studentNumber);
        int completeness = 25; // account details are always present once registered
        if (profile.isEmpty()) {
            missing.addAll(List.of("Bio", "Skills", "CV link"));
        } else {
            Profile p = profile.get();
            if (p.getBio() != null && !p.getBio().isBlank()) completeness += 25; else missing.add("Bio");
            if (p.getSkills() != null && !p.getSkills().isEmpty()) completeness += 25; else missing.add("Skills");
            if (p.getResumeLink() != null && !p.getResumeLink().isBlank()) completeness += 25; else missing.add("CV link");
        }

        return new StudentStats(apps.size(), active, offers, byStatus, completeness, missing);
    }

    public CompanyStats companyStats(String companyId) {
        List<Internship> postings = internshipRepository.findByCompanyId(companyId);
        List<Application> apps = applicationRepository.findByInternship_CompanyId(companyId);
        Map<String, Long> byStatus = countByStatus(apps);

        Map<String, List<Application>> perPosting = new HashMap<>();
        for (Application a : apps) {
            perPosting.computeIfAbsent(a.getInternship().getInternshipId(), k -> new ArrayList<>()).add(a);
        }

        List<PostingSummary> summaries = postings.stream()
                .sorted(Comparator.comparing(Internship::getDeadline, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(i -> {
                    List<Application> list = perPosting.getOrDefault(i.getInternshipId(), List.of());
                    long pending = list.stream().filter(a -> a.getStatus() == ApplicationStatus.PENDING
                            || a.getStatus() == ApplicationStatus.UNDER_REVIEW).count();
                    return new PostingSummary(i.getInternshipId(), i.getTitle(), i.isOpen(), i.getDeadline(),
                            list.size(), pending);
                })
                .toList();

        return new CompanyStats(
                postings.size(),
                postings.stream().filter(Internship::isOpen).count(),
                apps.size(),
                byStatus.get(ApplicationStatus.PENDING.name()) + byStatus.get(ApplicationStatus.UNDER_REVIEW.name()),
                byStatus.get(ApplicationStatus.SHORTLISTED.name()),
                byStatus.get(ApplicationStatus.ACCEPTED.name()),
                byStatus,
                summaries
        );
    }

    public AdminStats adminStats() {
        List<Application> apps = applicationRepository.findAll();
        List<Internship> internships = internshipRepository.findAll();
        Map<String, Long> byStatus = countByStatus(apps);
        long placements = byStatus.get(ApplicationStatus.ACCEPTED.name());
        long decided = placements + byStatus.get(ApplicationStatus.REJECTED.name());
        double rate = decided == 0 ? 0.0 : Math.round(placements * 1000.0 / decided) / 10.0;

        return new AdminStats(
                studentRepository.count(),
                companyRepository.count(),
                internships.size(),
                internships.stream().filter(Internship::isOpen).count(),
                apps.size(),
                placements,
                rate,
                byStatus
        );
    }

    private static Map<String, Long> countByStatus(List<Application> apps) {
        Map<String, Long> counts = new LinkedHashMap<>();
        for (ApplicationStatus s : ApplicationStatus.values()) {
            counts.put(s.name(), 0L);
        }
        for (Application a : apps) {
            ApplicationStatus s = a.getStatus() == null ? ApplicationStatus.PENDING : a.getStatus();
            counts.merge(s.name(), 1L, Long::sum);
        }
        return counts;
    }
}