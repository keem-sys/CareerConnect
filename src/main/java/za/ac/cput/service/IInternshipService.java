package za.ac.cput.service;

/*
IInternshipService.java
Internship Service Interface
Author: Refilwe Mabena (231013051)
Date: 8 August 2026
*/

import za.ac.cput.domain.Internship;
import za.ac.cput.dto.request.InternshipSearchCriteria;
import za.ac.cput.dto.response.InternshipResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface IInternshipService extends IService<Internship, String> {

    List<Internship> getInternshipsByLocation(String location);

    List<Internship> getInternshipsByTitle(String title);

    List<Internship> getUpcomingInternships(LocalDateTime deadline);

    List<InternshipResponse> search(InternshipSearchCriteria criteria);

    InternshipResponse getDetails(String internshipId);
}