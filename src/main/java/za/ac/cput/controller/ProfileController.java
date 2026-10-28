package za.ac.cput.controller;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Profile;
import za.ac.cput.repository.StudentRepository;
import za.ac.cput.service.IProfileService;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {
    private final IProfileService profileService;
    private final StudentRepository studentRepository;

    public ProfileController(IProfileService profileService, StudentRepository studentRepository) {
        this.profileService = profileService;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public Profile create(@RequestBody Profile profile, Authentication authentication) {
        requireStudentOwner(profile.getStudentNumber(), authentication);
        return profileService.create(profile);
    }

    @GetMapping("/read/{profileId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'COMPANY', 'ADMIN')")
    public Profile read(@PathVariable String profileId, Authentication authentication) {
        Profile profile = profileService.read(profileId);
        if (profile != null && isStudent(authentication)) {
            requireStudentOwner(profile.getStudentNumber(), authentication);
        }
        return profile;
    }

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public Profile update(@RequestBody Profile profile, Authentication authentication) {
        Profile existing = profileService.read(profile.getProfileId());
        if (existing != null) {
            requireStudentOwner(existing.getStudentNumber(), authentication);
        }
        return profileService.update(profile);
    }

    @DeleteMapping("/delete/{profileId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public boolean delete(@PathVariable String profileId, Authentication authentication) {
        Profile profile = profileService.read(profileId);
        if (profile != null) {
            requireStudentOwner(profile.getStudentNumber(), authentication);
        }
        return profileService.delete(profileId);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Profile> getAll() {
        return profileService.getAll();
    }

    @GetMapping("/student/{studentNumber}")
    @PreAuthorize("hasAnyRole('STUDENT', 'COMPANY', 'ADMIN')")
    public Optional<Profile> getByStudentNumber(@PathVariable String studentNumber,
                                                Authentication authentication) {
        if (isStudent(authentication)) {
            requireStudentOwner(studentNumber, authentication);
        }
        return profileService.getProfileByStudentNumber(studentNumber);
    }

    private void requireStudentOwner(String studentNumber, Authentication authentication) {
        if (!isAdmin(authentication) && !studentRepository.findByEmail(authentication.getName())
                .map(student -> student.getStudentNumber().equals(studentNumber))
                .orElse(false)) {
            throw new AccessDeniedException("Access Denied: You may only access your own profile.");
        }
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_ADMIN"));
    }

    private boolean isStudent(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> Objects.equals(a.getAuthority(), "ROLE_STUDENT"));
    }
}