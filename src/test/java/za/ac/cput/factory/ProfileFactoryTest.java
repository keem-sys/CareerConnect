package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Profile;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

/*
 * ProfileFactoryTest.java
 * Test class for ProfileFactory
 * Author: Oratilwe Komane (230716873)
 * Date: 11 March 2026
 */
public class ProfileFactoryTest {

    @Test
    public void testBuildProfile_Success() {
        List<String> skills = Arrays.asList("Java", "Spring Boot", "Git");
        Profile profile = ProfileFactory.buildProfile(
                "230716873",
                "Final year IT student",
                skills,
                "https://myresume.com/oratilwe"
        );
        assertNotNull(profile);
        assertNotNull(profile.getProfileId());
        assertEquals("230716873", profile.getStudentNumber());
        assertEquals("Final year IT student", profile.getBio());
        assertEquals(skills, profile.getSkills());
        assertEquals("https://myresume.com/oratilwe", profile.getResumeLink());
    }

    @Test
    public void testBuildProfile_NullBio_ReturnsNull() {
        List<String> skills = Arrays.asList("Python", "SQL");
        Profile profile = ProfileFactory.buildProfile("230716873", null, skills, "https://link.com");
        assertNull(profile);
    }

    @Test
    public void testBuildProfile_NullStudentNumber_ReturnsNull() {
        List<String> skills = Arrays.asList("Python", "SQL");
        Profile profile = ProfileFactory.buildProfile(null, "Some bio", skills, "https://link.com");
        assertNull(profile);
    }

    @Test
    public void testBuildProfile_IdIsUnique() {
        List<String> skills = Arrays.asList("Python", "SQL");
        Profile p1 = ProfileFactory.buildProfile("230716873", "Bio 1", skills, "https://link1.com");
        Profile p2 = ProfileFactory.buildProfile("230480152", "Bio 2", skills, "https://link2.com");
        assertNotEquals(p1.getProfileId(), p2.getProfileId());
    }
}