package za.ac.cput.factory;

import za.ac.cput.domain.Company;

/*
 * CompanyFactory.java
 * Factory class for Company entity with credential validation
 * Author: Sylvia Mahlangu (222954396)
 * Date: 18 October 2026
 */
public class CompanyFactory {

    public static Company createCompany(String companyId, String name, String industry, String contactEmail, String password) {

        if (isNullOrEmpty(companyId) ||
                isNullOrEmpty(name) ||
                isNullOrEmpty(industry) ||
                isNullOrEmpty(contactEmail) ||
                isNullOrEmpty(password)) {
            return null;
        }

        return new Company.Builder()
                .setCompanyId(companyId)
                .setName(name)
                .setIndustry(industry)
                .setContactEmail(contactEmail)
                .setPassword(password)
                .build();
    }

    private static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}