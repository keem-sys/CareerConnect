package za.ac.cput.repository;
/*
IInternshipRepository.java
InternshipRepository interface
Author: Refilwe Mabena (231013051)
Date: 24 March 2026
*/

import za.ac.cput.domain.Internship;
import java.util.List;

public interface IInternshipRepository {
    Internship create(Internship internship);
    Internship read(String internshipId);
    Internship update(Internship internship);
    boolean delete(String internshipId);

    List<Internship> getAll();
}
