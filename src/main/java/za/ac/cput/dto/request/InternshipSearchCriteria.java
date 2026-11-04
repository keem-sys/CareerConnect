package za.ac.cput.dto.request;

import za.ac.cput.domain.WorkMode;

/*
 * InternshipSearchCriteria.java
 * Filters accepted by GET /api/internship/search. Every field is optional.
 */
public record InternshipSearchCriteria(
        String q,
        String location,
        WorkMode workMode,
        String field,
        boolean paidOnly,
        boolean openOnly,
        String sort,
        Integer limit
) {
    public static InternshipSearchCriteria all() {
        return new InternshipSearchCriteria(null, null, null, null, false, false, null, null);
    }
}