package za.ac.cput.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Application;
import za.ac.cput.service.ApplicationService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/application")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Application application) {
        try {
            Application created = applicationService.apply(
                    application.getStudent(),
                    application.getInternship()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/read/{applicationId}")
    public ResponseEntity<Application> read(@PathVariable String applicationId) {
        Optional<Application> application = applicationService.read(applicationId);
        return application
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/update/{applicationId}")
    public ResponseEntity<?> updateStatus(@PathVariable String applicationId,
                                          @RequestParam String status) {
        try {
            Application updated = applicationService.updateStatus(applicationId, status);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{applicationId}")
    public ResponseEntity<?> delete(@PathVariable String applicationId) {
        try {
            applicationService.delete(applicationId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Application>> getAll() {
        return ResponseEntity.ok(applicationService.readAll());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(applicationService.readByStudent(studentId));
    }

    @GetMapping("/internship/{internshipId}")
    public ResponseEntity<List<Application>> getByInternship(@PathVariable String internshipId) {
        return ResponseEntity.ok(applicationService.readByInternship(internshipId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Application>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(applicationService.readByStatus(status));
    }
}