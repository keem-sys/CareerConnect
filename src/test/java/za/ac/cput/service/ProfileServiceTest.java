package za.ac.cput.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.domain.Profile;
import za.ac.cput.factory.ProfileFactory;
import za.ac.cput.repository.IProfileRepository;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/*
 * ProfileServiceTest.java
 * Profile service test class
 * Author: Oratilwe Komane (230716873)
 * Date: 26 August 2026
 */
@ExtendWith(MockitoExtension.class)
public class ProfileServiceTest {
    @Mock
    private IProfileRepository profileRepository;
    private Profile profile;

    @InjectMocks
    ProfileService profileService;

    @BeforeEach
    void setUp() {
        profile = ProfileFactory.buildProfile(
                "230716873",
                "Aspiring software developer",
                Collections.singletonList("Java"),
                "https://example.com/resume.pdf"
        );
    }

    @Test
    void create_Success() {
        when(profileRepository.save(any(Profile.class))).thenReturn(profile);
        Profile createdProfile = profileService.create(profile);
        assertNotNull(createdProfile);
        assertEquals("Aspiring software developer", createdProfile.getBio());
    }

    @Test
    void read_Success() {
        when(profileRepository.findById(anyString())).thenReturn(Optional.of(profile));
        Profile read = profileService.read(profile.getProfileId());
        assertNotNull(read);
        assertEquals("Aspiring software developer", read.getBio());
    }

    @Test
    void update_Success() {
        Profile updatedInfo = new Profile.Builder()
                .copy(profile)
                .setBio("Updated bio")
                .build();

        when(profileRepository.existsById(anyString())).thenReturn(true);
        when(profileRepository.save(any(Profile.class))).thenReturn(updatedInfo);

        Profile updatedResult = profileService.update(updatedInfo);

        assertNotNull(updatedResult);
        assertEquals("Updated bio", updatedResult.getBio());
    }

    @Test
    void delete_Success() {
        when(profileRepository.existsById(anyString())).thenReturn(true);
        boolean deleted = profileService.delete(profile.getProfileId());
        assertTrue(deleted);
        verify(profileRepository, times(1)).deleteById(profile.getProfileId());
    }

    @Test
    void getAll_Success() {
        List<Profile> mockList = Arrays.asList(profile, profile);
        when(profileRepository.findAll()).thenReturn(mockList);

        List<Profile> all = profileService.getAll();
        assertNotNull(all);
        assertEquals(2, all.size());
    }

    @Test
    void getProfileByStudentNumber_Success() {
        when(profileRepository.findByStudentNumber(anyString())).thenReturn(Optional.of(profile));
        Optional<Profile> found = profileService.getProfileByStudentNumber(profile.getStudentNumber());
        assertTrue(found.isPresent());
        assertEquals("230716873", found.get().getStudentNumber());
    }
}