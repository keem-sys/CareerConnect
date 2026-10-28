package za.ac.cput.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Objects;

/*
 * Student.java
 * Security-hardened Student entity
 * Author: Ebenezer Kouakou (230480152)
 * Date: 18 October 2026
 */

@Entity
@Table(name = "student")
public class Student {

    @Id
    @Column(name = "student_number", nullable = false, unique = true)
    private String studentNumber;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    protected Student() {
    }

    private Student(Builder builder) {
        this.studentNumber = builder.studentNumber;
        this.name = builder.name;
        this.email = builder.email;
        this.password = builder.password;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return "Student{" +
                "studentNumber='" + studentNumber + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return Objects.equals(studentNumber, student.studentNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentNumber);
    }

    public static class Builder {
        private String studentNumber;
        private String name;
        private String email;
        private String password;

        public Builder setStudentNumber(String studentNumber) {
            this.studentNumber = studentNumber;
            return this;
        }

        public Builder setName(String name) {
            this.name = name;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setPassword(String password) {
            this.password = password;
            return this;
        }

        public Builder copy(Student student) {
            this.studentNumber = student.studentNumber;
            this.name = student.name;
            this.email = student.email;
            this.password = student.password;
            return this;
        }

        public Student build() {
            return new Student( this);
        }
    }
}