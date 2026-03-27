package za.ac.cput.repository.impl;

import za.ac.cput.domain.Company;
import za.ac.cput.repository.ICompanyRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * CompanyRepository.java
 * Company repository class
 * Author: Sylvia Mahlangu (222954396)
 * Date: 24 March 2026
 */
public class CompanyRepository implements ICompanyRepository {

    private static CompanyRepository repository = null;
    private Map<String, Company> companyTable;

    private CompanyRepository() {
        companyTable = new HashMap<>();
    }

    public static CompanyRepository getRepository() {
        if (repository == null) {
            repository = new CompanyRepository();
        }
        return repository;
    }

    @Override
    public Company create(Company company) {
        if (company == null) return null;
        companyTable.put(company.getCompanyId(), company);
        return company;
    }

    @Override
    public Company read(String companyId) {
        return companyTable.get(companyId);
    }

    @Override
    public Company update(Company company) {
        if (company != null && companyTable.containsKey(company.getCompanyId())) {
            companyTable.put(company.getCompanyId(), company);
            return company;
        }
        return null;
    }

    @Override
    public boolean delete(String companyId) {
        return companyTable.remove(companyId) != null;
    }

    @Override
    public List<Company> getAll() {
        return new ArrayList<>(companyTable.values());
    }
}
