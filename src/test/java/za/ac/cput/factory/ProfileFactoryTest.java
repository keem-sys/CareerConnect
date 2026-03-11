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
                "Final year IT student",
                skills,
                "https://myresume.com/oratilwe"
        );
        assertNotNull(profile);
        assertNotNull(profile.getProfileId());
        assertEquals("Final year IT student", profile.getBio());
        assertEquals(skills, profile.getSkills());
        assertEquals("https://myresume.com/oratilwe", profile.getResumeLink());
    }

    @Test
    public void testBuildProfile_NullBio_ReturnsNull() {
        List<String> skills = Arrays.asList("Python", "SQL");
        Profile profile = ProfileFactory.buildProfile(null, skills, "https://link.com");
        assertNull(profile);
    }

    @Test
    public void testBuildProfile_IdIsUnique() {
        List<String> skills = Arrays.asList("Python", "SQL");
        Profile p1 = ProfileFactory.buildProfile("Bio 1", skills, "https://link1.com");
        Profile p2 = ProfileFactory.buildProfile("Bio 2", skills, "https://link2.com");
        assertNotEquals(p1.getProfileId(), p2.getProfileId());
    }
}
