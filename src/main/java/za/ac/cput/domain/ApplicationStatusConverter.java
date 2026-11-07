package za.ac.cput.domain;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/*
 * ApplicationStatusConverter.java
 * Stores the status as text and tolerates legacy values already in the database
 */
@Converter
public class ApplicationStatusConverter implements AttributeConverter<ApplicationStatus, String> {

    @Override
    public String convertToDatabaseColumn(ApplicationStatus status) {
        return status == null ? null : status.name();
    }

    @Override
    public ApplicationStatus convertToEntityAttribute(String value) {
        if (value == null || value.isBlank()) {
            return ApplicationStatus.PENDING;
        }
        try {
            return ApplicationStatus.fromString(value);
        } catch (IllegalArgumentException e) {
            return ApplicationStatus.PENDING;
        }
    }
}
