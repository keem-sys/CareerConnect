package za.ac.cput.controller;

import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Profile;
import za.ac.cput.service.IProfileService;

import java.util.List;
import java.util.Optional;

/*
 * ProfileController.java
 * Profile REST controller
 * Author: Oratilwe Komane (230716873)
 * Date: 11 March 2026
 */
@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {
    private final IProfileService profileService;

    public ProfileController(IProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping("/create")
    public Profile create(@RequestBody Profile profile) {
        return profileService.create(profile);
    }

    @GetMapping("/read/{profileId}")
    public Profile read(@PathVariable String profileId) {
        return profileService.read(profileId);
    }

    @PutMapping("/update")
    public Profile update(@RequestBody Profile profile) {
        return profileService.update(profile);
    }

    @DeleteMapping("/delete/{profileId}")
    public boolean delete(@PathVariable String profileId) {
        return profileService.delete(profileId);
    }

    @GetMapping("/getAll")
    public List<Profile> getAll() {
        return profileService.getAll();
    }

    @GetMapping("/student/{studentNumber}")
    public Optional<Profile> getByStudentNumber(@PathVariable String studentNumber) {
        return profileService.getProfileByStudentNumber(studentNumber);
    }
}