package za.ac.cput.factory;

/*
InternshipFactory
Author: Refilwe Mabena (231013051)
Date: 14 March 2026
*/


import java.time.LocalDateTime;
import za.ac.cput.domain.Internship;

  public class InternshipFactory {
    public static Internship createInternship(String internshipId,
                                              String title,
                                              String description,
                                              String location,
                                              LocalDateTime deadline){
      if (internshipId == null || internshipId.isEmpty())
        return null;

      if (title == null || title.isEmpty())
        return null;

      if (description == null || description.isEmpty())
        return null;

      if (location == null || location.isEmpty())
        return null;

      if (deadline == null)
        return null;

      return new Internship.Builder()
              .setInternshipId(internshipId)
              .setTitle(title)
              .setDescription(description)
              .setLocation(location)
              .setDeadline(deadline)
              .build();

    }
  }
