package za.ac.cput.domain;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ApplicationStatusTest {

    @Test
    void fromString_mapsLegacyValues() {
        assertEquals(ApplicationStatus.ACCEPTED, ApplicationStatus.fromString("Approved"));
        assertEquals(ApplicationStatus.PENDING, ApplicationStatus.fromString("Pending"));
        assertEquals(ApplicationStatus.SHORTLISTED, ApplicationStatus.fromString("Interview Scheduled"));
        assertEquals(ApplicationStatus.UNDER_REVIEW, ApplicationStatus.fromString("under_review"));
    }

    @Test
    void fromString_rejectsUnknown() {
        assertThrows(IllegalArgumentException.class, () -> ApplicationStatus.fromString("Maybe"));
        assertThrows(IllegalArgumentException.class, () -> ApplicationStatus.fromString(" "));
    }

    @Test
    void transitions_onlyMoveForward() {
        assertTrue(ApplicationStatus.PENDING.canTransitionTo(ApplicationStatus.SHORTLISTED));
        assertTrue(ApplicationStatus.SHORTLISTED.canTransitionTo(ApplicationStatus.ACCEPTED));
        assertFalse(ApplicationStatus.SHORTLISTED.canTransitionTo(ApplicationStatus.PENDING));
        assertFalse(ApplicationStatus.ACCEPTED.canTransitionTo(ApplicationStatus.REJECTED));
        assertFalse(ApplicationStatus.WITHDRAWN.canTransitionTo(ApplicationStatus.PENDING));
    }
}
