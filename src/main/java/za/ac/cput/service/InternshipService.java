package za.ac.cput.service;

/*
InternshipService.java
Internship Service
Author: Refilwe Mabena (231013051)
Date: 6 August 2026
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.Application;
import za.ac.cput.domain.Company;
import za.ac.cput.domain.Internship;
import za.ac.cput.dto.request.InternshipSearchCriteria;
import za.ac.cput.dto.response.InternshipResponse;
import za.ac.cput.factory.InternshipFactory;
import za.ac.cput.repository.ApplicationRepository;
import za.ac.cput.repository.CompanyRepository;
import za.ac.cput.repository.InternshipRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class InternshipService implements IInternshipService {

    private final InternshipRepository internshipRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;

    @Autowired
    public InternshipService(InternshipRepository internshipRepository,
                             CompanyRepository companyRepository,
                             ApplicationRepository applicationRepository) {
        this.internshipRepository = internshipRepository;
        this.companyRepository = companyRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public Internship create(Internship internship) {
        // Factory validation: id, company, title, description, location and deadline are required
        Internship validatedInternship = InternshipFactory.createInternship(
                internship.getInternshipId(),
                internship.getCompanyId(),
                internship.getTitle(),
                internship.getDescription(),
                internship.getLocation(),
                internship.getDeadline()
        );

        if (validatedInternship == null) {
            System.err.println("Posting internship failed: Missing or invalid fields caught by InternshipFactory.");
            return null;
        }

        // Business rule: the internship deadline must be in the future.
        if (!internship.getDeadline().isAfter(LocalDateTime.now())) {
            System.out.println("Posting Failed: Deadline must be in the future.");
            return null;
        }

        if (internship.getStipend() != null && internship.getStipend() < 0) {
            System.out.println("Posting Failed: Stipend cannot be negative.");
            return null;
        }

        if (internshipRepository.existsById(internship.getInternshipId())) {
            System.out.println("Posting Failed: Internship ID already exists.");
            return null;
        }

        if (internship.getCreatedAt() == null) {
            internship.setCreatedAt(LocalDateTime.now());
        }
        if (internship.getPositions() == null || internship.getPositions() < 1) {
            internship.setPositions(1);
        }

        return internshipRepository.save(internship);
    }

    @Override
    public Internship read(String id) {
        return internshipRepository.findById(id).orElse(null);
    }

    @Override
    public Internship update(Internship internship) {
        if (!internshipRepository.existsById(internship.getInternshipId())) {
            return null;
        }
        if (internship.getCreatedAt() == null) {
            internshipRepository.findById(internship.getInternshipId())
                    .ifPresent(existing -> internship.setCreatedAt(existing.getCreatedAt()));
        }
        return internshipRepository.save(internship);
    }

    @Override
    public boolean delete(String id) {
        if (internshipRepository.existsById(id)) {
            internshipRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Internship> getAll() {
        return internshipRepository.findAll();
    }

    @Override
    public List<Internship> getInternshipsByLocation(String location) {
        return internshipRepository.findByLocation(location);
    }

    @Override
    public List<Internship> getInternshipsByTitle(String title) {
        return internshipRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<Internship> getUpcomingInternships(LocalDateTime deadline) {
        return internshipRepository.findByDeadlineAfter(deadline);
    }

    @Override
    public InternshipResponse getDetails(String internshipId) {
        return internshipRepository.findById(internshipId)
                .map(i -> InternshipResponse.from(
                        i,
                        companyRepository.findById(i.getCompanyId()).orElse(null),
                        applicationRepository.countByInternship_InternshipId(i.getInternshipId())))
                .orElse(null);
    }

    @Override
    public List<InternshipResponse> search(InternshipSearchCriteria criteria) {
        InternshipSearchCriteria c = criteria == null ? InternshipSearchCriteria.all() : criteria;

        Map<String, Company> companies = companyRepository.findAll().stream()
                .collect(Collectors.toMap(Company::getCompanyId, Function.identity(), (a, b) -> a));
        Map<String, Long> applicantCounts = applicationRepository.findAll().stream()
                .filter(a -> a.getInternship() != null)
                .collect(Collectors.groupingBy(a -> a.getInternship().getInternshipId(), Collectors.counting()));

        String q = normalise(c.q());
        String location = normalise(c.location());
        String field = normalise(c.field());

        Stream<Internship> stream = internshipRepository.findAll().stream()
                .filter(i -> q == null || matchesKeyword(i, companies.get(i.getCompanyId()), q))
                .filter(i -> location == null || contains(i.getLocation(), location))
                .filter(i -> c.workMode() == null || c.workMode() == i.getWorkMode())
                .filter(i -> field == null || contains(i.getFieldOfStudy(), field))
                .filter(i -> !c.paidOnly() || (i.getStipend() != null && i.getStipend() > 0))
                .filter(i -> !c.openOnly() || i.isOpen());

        stream = stream.sorted(comparatorFor(c.sort()));
        if (c.limit() != null && c.limit() > 0) {
            stream = stream.limit(c.limit());
        }

        return stream
                .map(i -> InternshipResponse.from(i, companies.get(i.getCompanyId()),
                        applicantCounts.getOrDefault(i.getInternshipId(), 0L)))
                .toList();
    }

    private static Comparator<Internship> comparatorFor(String sort) {
        String key = sort == null ? "newest" : sort.trim().toLowerCase();
        Comparator<Internship> openFirst = Comparator.comparing(i -> !i.isOpen());
        return switch (key) {
            case "deadline" -> openFirst.thenComparing(Internship::getDeadline,
                    Comparator.nullsLast(Comparator.naturalOrder()));
            case "stipend" -> Comparator.comparing(
                    (Internship i) -> i.getStipend() == null ? 0 : i.getStipend()).reversed();
            case "title" -> Comparator.comparing(i -> i.getTitle() == null ? "" : i.getTitle().toLowerCase());
            default -> Comparator.comparing(
                    (Internship i) -> i.getCreatedAt() == null ? LocalDateTime.MIN : i.getCreatedAt()).reversed();
        };
    }

    private static boolean matchesKeyword(Internship i, Company company, String q) {
        if (contains(i.getTitle(), q) || contains(i.getDescription(), q) || contains(i.getFieldOfStudy(), q)) {
            return true;
        }
        if (company != null && (contains(company.getName(), q) || contains(company.getIndustry(), q))) {
            return true;
        }
        return i.getRequiredSkills() != null && i.getRequiredSkills().stream().anyMatch(s -> contains(s, q));
    }

    private static boolean contains(String haystack, String needle) {
        return haystack != null && haystack.toLowerCase().contains(needle);
    }

    private static String normalise(String value) {
        return value == null || value.isBlank() ? null : value.trim().toLowerCase();
    }
}