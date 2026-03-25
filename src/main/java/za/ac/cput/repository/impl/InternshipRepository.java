package za.ac.cput.repository.impl;

/*
InternshipRepository.java
InternshipRepository class
Author: Refilwe Mabena (231013051)
Date: 24 March 2026
*/
import za.ac.cput.domain.Internship;
import za.ac.cput.repository.IInternshipRepository;


import java.util.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class InternshipRepository implements IInternshipRepository {

    private static InternshipRepository repository = null;
    private Map<String, Internship> internshipMap;

    private InternshipRepository() {
        internshipMap = new HashMap<>();
    }

    public static InternshipRepository getRepository() {
        if (repository == null) {
            repository = new InternshipRepository();
        }
        return repository;
    }
@Override
    public Internship create(Internship internship) {
        if (internship == null)
            return null;

        internshipMap.put(internship.getInternshipId(), internship);
        return internship;
    }
@Override
    public Internship read(String InternshipId) {
        return internshipMap.get(internshipId);
    }

    @Override
    public Internship update(Internship internship) {
        if (internshipMap.containsKey(internship.getInternshipId())) {
            internshipMap.put(internship.getInternshipId(), internship);
            return internship;
        }
        return null;
    }
@Override
    public boolean delete(String internshipId) {
        return internshipMap.remove(internshipId) != null;
    }
@Override
    public List<Internship> getAll() {
        return new ArrayList<>(internshipMap.values());
    }
}






