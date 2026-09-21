package za.ac.cput.service;

/*
InternshipService.java
Internship Service
Author: Refilwe Mabena (231013051)
Date: 6 August 2026
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.Internship;
import za.ac.cput.factory.InternshipFactory;
import za.ac.cput.repository.InternshipRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InternshipService implements IInternshipService {

    private final InternshipRepository internshipRepository;

    @Autowired
    public InternshipService(InternshipRepository internshipRepository) {
        this.internshipRepository = internshipRepository;
    }


    @Override
    public Internship create(Internship internship) {
       // Run Factory Validation (Safely checks for null/empty title, description, location, deadline)
        Internship validatedInternship = InternshipFactory.createInternship(
                internship.getInternshipId(),
                internship.getTitle(),
                internship.getDescription(),
                internship.getLocation(),
                internship.getDeadline()
        );

        if (validatedInternship == null) {
            System.err.println("Posting internship failed: Missing or invalid fields caught by InternshipFactory.");
            return null;
        }

        // Business rule:
        // The internship deadline must be in the future.
        if (!internship.getDeadline().isAfter(LocalDateTime.now())) {
            System.out.println("Posting Failed: Deadline must be in the future.");
            return null;
        }

        // Prevent Duplicate IDs
        if (internshipRepository.existsById(internship.getInternshipId())) {
            System.out.println("Posting Failed: Internship ID already exists.");
            return null;
        }

        return internshipRepository.save(internship);
    }

    @Override
    public Internship read(String id) {
        return internshipRepository.findById(id).orElse(null);
    }

    @Override
    public Internship update(Internship internship) {
        if (internshipRepository.existsById(internship.getInternshipId())) {
            return internshipRepository.save(internship);
        }
        return null;
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
}
