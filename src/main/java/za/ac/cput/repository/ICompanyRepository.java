package za.ac.cput.repository;

import za.ac.cput.domain.Company;
import java.util.Set;
/*
 * ICompanyRepository.java
 * ICompanyRepository interface
 * Author: Sylvia Mahlangu(222954396)
 * Date: 24 March 2026
 */
public interface ICompanyRepository {

    Company create(Company company);
    Company read(String companyId);
    Company update(Company company);
    boolean delete(String companyId);
    Set<Company> getAll();
}