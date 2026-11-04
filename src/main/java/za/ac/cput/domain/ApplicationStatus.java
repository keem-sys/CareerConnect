package za.ac.cput.domain;

import java.util.EnumSet;
import java.util.Set;

/*
 * ApplicationStatus.java
 * Lifecycle of an internship application and the transitions allowed between stages
 */
public enum ApplicationStatus {
    PENDING,
    UNDER_REVIEW,
    SHORTLISTED,
    ACCEPTED,
    REJECTED,
    WITHDRAWN;

    public boolean isFinal() {
        return this == ACCEPTED || this == REJECTED || this == WITHDRAWN;
    }

    public Set<ApplicationStatus> allowedNext() {
        return switch (this) {
            case PENDING -> EnumSet.of(UNDER_REVIEW, SHORTLISTED, ACCEPTED, REJECTED, WITHDRAWN);
            case UNDER_REVIEW -> EnumSet.of(SHORTLISTED, ACCEPTED, REJECTED, WITHDRAWN);
            case SHORTLISTED -> EnumSet.of(ACCEPTED, REJECTED, WITHDRAWN);
            default -> EnumSet.noneOf(ApplicationStatus.class);
        };
    }

    public boolean canTransitionTo(ApplicationStatus next) {
        return next != null && allowedNext().contains(next);
    }

    public static ApplicationStatus fromString(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Application status cannot be empty");
        }
        String normalised = value.trim().toUpperCase().replace(' ', '_').replace('-', '_');
        return switch (normalised) {
            case "APPROVED", "ACCEPTED" -> ACCEPTED;
            case "INTERVIEW_SCHEDULED", "INTERVIEW", "SHORTLISTED" -> SHORTLISTED;
            case "IN_REVIEW", "REVIEWING", "UNDER_REVIEW" -> UNDER_REVIEW;
            case "DECLINED", "REJECTED" -> REJECTED;
            case "WITHDRAWN", "CANCELLED" -> WITHDRAWN;
            case "PENDING", "SUBMITTED" -> PENDING;
            default -> throw new IllegalArgumentException("Unknown application status: " + value);
        };
    }
}
