
package za.ac.cput.dto.request;

/*
InternshipRequest.java
Internship Request
Author: Refilwe Mabena (231013051)
Date: 27 October 2026
*/

import java.time.LocalDateTime;

public class InternshipRequest {

    private String title;
    private String description;
    private String location;
    private LocalDateTime deadline;

    public InternshipRequest() {
    }

    public InternshipRequest(String title, String description,
                             String location, LocalDateTime deadline) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.deadline = deadline;
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
}
