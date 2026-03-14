package za.ac.cput.domain;

import java.time.LocalDateTime;
import java.util.Objects;

/*
 * Application.java
 * Application entity class
 * Author: Mojalefa Mabotja (223227498)
 * Date: 11 March 2026
 */

public class Application {

    private final String applicationId;
    private final String status;
    private final LocalDateTime dateApplied;
    private final Student student;
    private final Internship internship;

    private Application(Builder builder) {
        this.applicationId = builder.applicationId;
        this.status = builder.status;
        this.dateApplied = builder.dateApplied;
        this.student = builder.student;
        this.internship = builder.internship;

    }

    public String getApplicationId() {
        return applicationId; }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getDateApplied() {
        return dateApplied;
    }

    public Student getStudent() {
        return student;
    }

    public Internship getInternship() {
        return internship;
    }

    @Override
    public String toString() {
        return "Application{" +
                "applicationId='" + applicationId + '\'' +
                ", status='" + status + '\'' +
                ", dateApplied=" + dateApplied +
                ", student=" + student +
                ", internship=" + internship +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Application)) return false;
        Application that = (Application) o;
        return Objects.equals(applicationId, that.applicationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(applicationId);
    }

    public static class Builder {

        private String applicationId;
        private String status;
        private LocalDateTime dateApplied;
        private Student student;
        private Internship internship;

        public Builder setApplicationId(String applicationId){
            this.applicationId = applicationId;
            return this;
        }

        public Builder setStatus(String status){
            this.status = status;
            return this;
        }

        public Builder setDateApplied(LocalDateTime dateApplied){
            this.dateApplied = dateApplied;
            return this;
        }

        public Builder setStudent(Student student){
            this.student = student;
            return this;
        }

        public Builder setInternship(Internship internship){
            this.internship = internship;
            return this;
        }

        public Builder copy(Application application) {
            this.applicationId = application.applicationId;
            this.status = application.status;
            this.dateApplied = application.dateApplied;
            this.student = application.student;
            this.internship=application.internship;
            return this;
        }

        public Application build(){
            return new Application(this);
        }

    }

}
