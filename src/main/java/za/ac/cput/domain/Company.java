package za.ac.cput.domain;
import java.util.Objects;


/*
 * Student.java
 * Company entity class
 * Author: Sylvia Mahlangu (222954396)
 * Date: 24 March 2026
 */
public class Company {

    private String companyId;
    private String name;
    private String industry;
    private String contactEmail;

    private Company(Builder builder) {
        this.companyId = builder.companyId;
        this.name = builder.name;
        this.industry = builder.industry;
        this.contactEmail = builder.contactEmail;
    }

    public String getCompanyId() {
        return companyId;
    }

    public String getName() {
        return name;
    }

    public String getIndustry() {
        return industry;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    @Override
    public String toString() {
        return "Company{" +
                "companyId='" + companyId + '\'' +
                ", name='" + name + '\'' +
                ", industry='" + industry + '\'' +
                ", contactEmail='" + contactEmail + '\'' +
                '}';
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Company company = (Company) o;
        return Objects.equals(companyId, company.companyId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(companyId);
    }

    public static class Builder {
        private String companyId;
        private String name;
        private String industry;
        private String contactEmail;

        public Builder setCompanyId(String companyId) {
            this.companyId = companyId;
            return this;
        }

        public Builder setName(String name) {
            this.name = name;
            return this;
        }

        public Builder setIndustry(String industry) {
            this.industry = industry;
            return this;
        }

        public Builder setContactEmail(String contactEmail) {
            this.contactEmail = contactEmail;
            return this;
        }

        public Builder copy(Company company) {
            this.companyId = company.companyId;
            this.name = company.name;
            this.industry = company.industry;
            this.contactEmail = company.contactEmail;
            return this;
        }

        public Company build() {
            return new Company(this);
        }
    }
}