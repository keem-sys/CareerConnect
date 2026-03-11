package za.ac.cput.repository.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Profile;
import za.ac.cput.factory.ProfileFactory;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

/*
 * ProfileRepositoryImplTest.java
 * Test class for ProfileRepositoryImpl
 * Author: Oratilwe Komane (230716873)
 * Date: 11 March 2026
 */
public class ProfileRepositoryImplTest {
    private ProfileRepositoryImpl repository;
    private Profile profile;

    @BeforeEach
    public void setUp() {
        repository = ProfileRepositoryImpl.getInstance();
        List<String> skills = Arrays.asList("Java", "Git", "Maven");
        profile = ProfileFactory.buildProfile(
                "Final year IT student",
                skills,
                "https://myresume.com/oratilwe"
        );
    }

    @Test
    public void testCreate() {
        Profile created = repository.create(profile);
        assertNotNull(created);
        assertEquals(profile.getProfileId(), created.getProfileId());
    }

    @Test
    public void testRead() {
        repository.create(profile);
        Profile found = repository.read(profile.getProfileId());
        assertNotNull(found);
        assertEquals(profile.getProfileId(), found.getProfileId());
    }

    @Test
    public void testUpdate() {
        repository.create(profile);
        Profile updated = new Profile.Builder()
                .copy(profile)
                .setBio("Updated bio")
                .build();
        Profile result = repository.update(updated);
        assertNotNull(result);
        assertEquals("Updated bio", result.getBio());
    }

    @Test
    public void testDelete() {
        repository.create(profile);
        boolean deleted = repository.delete(profile.getProfileId());
        assertTrue(deleted);
        assertNull(repository.read(profile.getProfileId()));
    }

    @Test
    public void testGetAll() {
        repository.create(profile);
        List<Profile> all = repository.getAll();
        assertFalse(all.isEmpty());
    }
}