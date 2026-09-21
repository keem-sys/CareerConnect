package za.ac.cput.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.Profile;
import za.ac.cput.factory.ProfileFactory;
import za.ac.cput.repository.IProfileRepository;

import java.util.List;
import java.util.Optional;

/*
 * ProfileService.java
 * ProfileService implementation class
 * Author: Oratilwe Komane (230716873)
 * Date: 11 March 2026
 */
@Service
public class ProfileService implements IProfileService {
    private final IProfileRepository profileRepository;

    @Autowired
    public ProfileService(IProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    public Profile create(Profile profile) {
        Profile built = ProfileFactory.buildProfile(
                profile.getStudentNumber(),
                profile.getBio(),
                profile.getSkills(),
                profile.getResumeLink()
        );

        if (built == null) {
            System.out.println("Profile creation failed: invalid fields");
            return null;
        }

        return profileRepository.save(built);
    }

    @Override
    public Profile read(String profileId) {
        return profileRepository.findById(profileId).orElse(null);
    }

    @Override
    public Profile update(Profile profile) {
        if (profileRepository.existsById(profile.getProfileId())) {
            return profileRepository.save(profile);
        }
        return null;
    }

    @Override
    public boolean delete(String profileId) {
        if (profileRepository.existsById(profileId)) {
            profileRepository.deleteById(profileId);
            return true;
        }
        return false;
    }

    @Override
    public List<Profile> getAll() {
        return profileRepository.findAll();
    }

    @Override
    public Optional<Profile> getProfileByStudentNumber(String studentNumber) {
        return profileRepository.findByStudentNumber(studentNumber);
    }
}