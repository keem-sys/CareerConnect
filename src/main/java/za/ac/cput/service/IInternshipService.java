package za.ac.cput.service;

/*
IInternshipService.java
Internship Service Interface
Author: Refilwe Mabena (231013051)
Date: 27 October 2026
*/


import za.ac.cput.dto.request.InternshipRequest;
import za.ac.cput.dto.response.InternshipResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface IInternshipService {

    InternshipResponse create(InternshipRequest request);

    InternshipResponse read(String id);

    InternshipResponse update(String id, InternshipRequest request);

    boolean delete(String id);

    List<InternshipResponse> getAll();

    List<InternshipResponse> getInternshipsByLocation(String location);

    List<InternshipResponse> getInternshipsByTitle(String title);

    List<InternshipResponse> getUpcomingInternships(
            LocalDateTime deadline);
}
