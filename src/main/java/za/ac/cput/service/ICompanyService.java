package za.ac.cput.service;

import za.ac.cput.domain.Company;

import java.util.List;
import java.util.Optional;

/*
 * ICompanyService.java
 * Company Service Interface
 * Author: Sylvia Mahlangu (222954396)
 * Date: 19 October 2026
 */
public interface ICompanyService {
    Company create(Company company);
    Company read(String companyId);
    Company update(Company company);
    boolean delete(String companyId);
    List<Company> getAll();
    Optional<Company> getCompanyByEmail(String contactEmail);
    List<Company> getCompaniesByName(String name);
    List<Company> getCompaniesByIndustry(String industry);
}