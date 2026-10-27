
package za.ac.cput.dto.response;

/*
InternshipResponse.java
Internship Response
Author: Refilwe Mabena (231013051)
Date: 27 October 2026
*/

import java.time.LocalDateTime;

public class InternshipResponse {

    private String internshipId;
    private String title;
    private String description;
    private String location;
    private LocalDateTime deadline;
    private boolean active;

    public InternshipResponse() {
    }

    public InternshipResponse(String internshipId, String title,
                              String description, String location,
                              LocalDateTime deadline, boolean active) {
        this.internshipId = internshipId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.deadline = deadline;
        this.active = active;
    }

    public String getInternshipId() {
        return internshipId;
    }

    public void setInternshipId(String internshipId) {
        this.internshipId = internshipId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
