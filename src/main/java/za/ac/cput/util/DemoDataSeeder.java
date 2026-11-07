package za.ac.cput.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import za.ac.cput.domain.*;
import za.ac.cput.repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/*
 * DemoDataSeeder.java
 * Seeds realistic demo data so the platform
 */
@Component
@Order(10)
@ConditionalOnProperty(name = "careerconnect.demo.seed", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {

    public static final String DEMO_PASSWORD = "Demo@1234";

    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;
    private final ProfileRepository profileRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(CompanyRepository companyRepository, StudentRepository studentRepository,
                          ProfileRepository profileRepository, InternshipRepository internshipRepository,
                          ApplicationRepository applicationRepository, PasswordEncoder passwordEncoder) {
        this.companyRepository = companyRepository;
        this.studentRepository = studentRepository;
        this.profileRepository = profileRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (companyRepository.existsById("COMP-DEMO-01")) {
            return;
        }
        String hash = passwordEncoder.encode(DEMO_PASSWORD);
        LocalDateTime now = LocalDateTime.now();

        List<Company> companies = List.of(
                company("COMP-DEMO-01", "Takealot Group", "E-commerce & Technology", "careers@takealot.demo", hash),
                company("COMP-DEMO-02", "Discovery Limited", "Financial Services", "graduates@discovery.demo", hash),
                company("COMP-DEMO-03", "Entelect", "Software Engineering", "talent@entelect.demo", hash),
                company("COMP-DEMO-04", "Standard Bank", "Banking", "internships@standardbank.demo", hash),
                company("COMP-DEMO-05", "Amazon Web Services Cape Town", "Cloud Computing", "aws-ct@amazon.demo", hash),
                company("COMP-DEMO-06", "City of Cape Town", "Public Sector", "ict-internships@capetown.demo", hash)
        );
        companyRepository.saveAll(companies);

        List<Student> students = List.of(
                student("230480152", "Thandiwe Mokoena", "230480152@mycput.ac.za", hash),
                student("221345678", "Sipho Ndlovu", "221345678@mycput.ac.za", hash),
                student("222987654", "Aisha Patel", "222987654@mycput.ac.za", hash),
                student("223456789", "Liam van der Merwe", "223456789@mycput.ac.za", hash),
                student("224112233", "Naledi Khumalo", "224112233@mycput.ac.za", hash)
        );
        studentRepository.saveAll(students);

        profileRepository.saveAll(List.of(
                profile("PRF-DEMO-1", "230480152", "3rd-year Application Development student passionate about full-stack web apps and clean UI.",
                        List.of("Java", "Spring Boot", "React", "SQL", "Git"), "https://linkedin.com/in/thandiwe-demo"),
                profile("PRF-DEMO-2", "221345678", "Aspiring data analyst who loves turning messy data into insights.",
                        List.of("Python", "SQL", "Power BI", "Excel"), "https://linkedin.com/in/sipho-demo"),
                profile("PRF-DEMO-3", "222987654", "Cloud and DevOps enthusiast. AWS Cloud Practitioner certified.",
                        List.of("AWS", "Docker", "Linux", "Java"), null),
                profile("PRF-DEMO-4", "223456789", null, List.of("C#", ".NET"), null)
        ));

        List<Internship> internships = new ArrayList<>();
        internships.add(internship("INT-DEMO-01", "COMP-DEMO-01", "Software Engineering Intern",
                "Join our Platform team building the services behind South Africa's largest online retailer. You will ship features in Java and React alongside senior engineers.",
                "Cape Town", WorkMode.HYBRID, 8500, 6, "Software Development", List.of("Java", "Spring Boot", "React", "Git"), 3, now.plusDays(21), now.minusDays(2)));
        internships.add(internship("INT-DEMO-02", "COMP-DEMO-01", "UX/UI Design Intern",
                "Help redesign the customer checkout experience. Work with researchers and product managers to prototype and test new flows in Figma.",
                "Cape Town", WorkMode.ONSITE, 7000, 6, "Multimedia & Design", List.of("Figma", "User Research", "Prototyping"), 1, now.plusDays(14), now.minusDays(5)));
        internships.add(internship("INT-DEMO-03", "COMP-DEMO-02", "Data Analyst Intern",
                "Analyse member health and wellness data to support the Vitality programme. Build dashboards and present findings to stakeholders.",
                "Johannesburg", WorkMode.HYBRID, 9500, 12, "Data Science", List.of("SQL", "Python", "Power BI"), 2, now.plusDays(30), now.minusDays(1)));
        internships.add(internship("INT-DEMO-04", "COMP-DEMO-02", "Actuarial Systems Intern",
                "Support the actuarial systems team in automating reporting pipelines and validating models.",
                "Johannesburg", WorkMode.ONSITE, 10000, 12, "Information Systems", List.of("Excel", "VBA", "SQL"), 1, now.plusDays(10), now.minusDays(9)));
        internships.add(internship("INT-DEMO-05", "COMP-DEMO-03", "Graduate Java Developer Intern",
                "Entelect's internship programme puts you on real client projects from week one with structured mentorship and training.",
                "Cape Town", WorkMode.HYBRID, 12000, 6, "Software Development", List.of("Java", "OOP", "SQL", "Unit Testing"), 4, now.plusDays(25), now.minusDays(3)));
        internships.add(internship("INT-DEMO-06", "COMP-DEMO-03", "Frontend Developer Intern",
                "Build responsive React interfaces for enterprise clients using TypeScript and modern tooling.",
                "Remote (South Africa)", WorkMode.REMOTE, 11000, 6, "Software Development", List.of("React", "JavaScript", "CSS", "TypeScript"), 2, now.plusDays(18), now.minusDays(4)));
        internships.add(internship("INT-DEMO-07", "COMP-DEMO-04", "Cybersecurity Intern",
                "Work in the Security Operations Centre monitoring threats, triaging alerts and improving detection rules.",
                "Johannesburg", WorkMode.ONSITE, 9000, 12, "Networking & Security", List.of("Networking", "Linux", "SIEM"), 2, now.plusDays(12), now.minusDays(6)));
        internships.add(internship("INT-DEMO-08", "COMP-DEMO-04", "IT Business Analyst Intern",
                "Gather requirements, map processes and write user stories for digital banking initiatives.",
                "Cape Town", WorkMode.HYBRID, 8000, 6, "Information Systems", List.of("Requirements Analysis", "UML", "Communication"), 2, now.plusDays(35), now.minusDays(1)));
        internships.add(internship("INT-DEMO-09", "COMP-DEMO-05", "Cloud Support Associate Intern",
                "Help AWS customers solve technical challenges across compute, networking and storage. Includes AWS certification support.",
                "Cape Town", WorkMode.ONSITE, 15000, 6, "Cloud Computing", List.of("AWS", "Linux", "Networking", "Python"), 5, now.plusDays(28), now));
        internships.add(internship("INT-DEMO-10", "COMP-DEMO-05", "DevOps Engineering Intern",
                "Automate infrastructure and CI/CD pipelines for internal services using Docker and Terraform.",
                "Remote (South Africa)", WorkMode.REMOTE, 14000, 6, "Cloud Computing", List.of("Docker", "CI/CD", "Terraform", "Linux"), 1, now.plusDays(7), now.minusDays(12)));
        internships.add(internship("INT-DEMO-11", "COMP-DEMO-06", "ICT Support Intern",
                "Provide desktop and network support to municipal departments across the metro.",
                "Cape Town", WorkMode.ONSITE, 5000, 12, "Networking & Security", List.of("Hardware", "Windows", "Networking"), 6, now.plusDays(40), now.minusDays(8)));
        internships.add(internship("INT-DEMO-12", "COMP-DEMO-06", "GIS & Data Intern",
                "Maintain spatial datasets and build open-data reports that help plan city services.",
                "Cape Town", WorkMode.HYBRID, 5500, 12, "Data Science", List.of("GIS", "SQL", "Excel"), 2, now.minusDays(3), now.minusDays(30)));
        internships.add(internship("INT-DEMO-13", "COMP-DEMO-03", "Mobile App Developer Intern",
                "Build cross-platform mobile features with Flutter for a fintech client.",
                "Durban", WorkMode.HYBRID, 10500, 6, "Software Development", List.of("Flutter", "Dart", "REST APIs"), 2, now.plusDays(16), now.minusDays(2)));
        internships.add(internship("INT-DEMO-14", "COMP-DEMO-02", "QA Automation Intern",
                "Write automated UI and API tests and help the team ship faster with confidence.",
                "Remote (South Africa)", WorkMode.REMOTE, 8500, 6, "Software Development", List.of("Selenium", "Java", "Testing"), 1, now.minusDays(1), now.minusDays(25)));
        internshipRepository.saveAll(internships);

        Student thandi = students.get(0), sipho = students.get(1), aisha = students.get(2), liam = students.get(3), naledi = students.get(4);
        List<Application> apps = List.of(
                app("APP-DEMO-01", thandi, internships.get(0), ApplicationStatus.SHORTLISTED, now.minusDays(2), "I have built several Spring Boot + React projects including CareerConnect and would love to grow at Takealot."),
                app("APP-DEMO-02", thandi, internships.get(4), ApplicationStatus.UNDER_REVIEW, now.minusDays(3), "Entelect's mentorship model is exactly the environment I want to start my career in."),
                app("APP-DEMO-03", thandi, internships.get(5), ApplicationStatus.PENDING, now.minusDays(1), null),
                app("APP-DEMO-04", thandi, internships.get(10), ApplicationStatus.REJECTED, now.minusDays(7), null),
                app("APP-DEMO-05", sipho, internships.get(2), ApplicationStatus.ACCEPTED, now.minusDays(1), "I love working with data and have completed a Power BI course."),
                app("APP-DEMO-06", sipho, internships.get(11), ApplicationStatus.UNDER_REVIEW, now.minusDays(20), null),
                app("APP-DEMO-07", sipho, internships.get(7), ApplicationStatus.PENDING, now.minusDays(1), null),
                app("APP-DEMO-08", aisha, internships.get(8), ApplicationStatus.SHORTLISTED, now, "AWS Cloud Practitioner certified and keen to help customers."),
                app("APP-DEMO-09", aisha, internships.get(9), ApplicationStatus.ACCEPTED, now.minusDays(10), null),
                app("APP-DEMO-10", aisha, internships.get(0), ApplicationStatus.PENDING, now.minusDays(1), null),
                app("APP-DEMO-11", liam, internships.get(4), ApplicationStatus.PENDING, now.minusDays(2), null),
                app("APP-DEMO-12", liam, internships.get(6), ApplicationStatus.WITHDRAWN, now.minusDays(5), null),
                app("APP-DEMO-13", liam, internships.get(13), ApplicationStatus.REJECTED, now.minusDays(20), null),
                app("APP-DEMO-14", naledi, internships.get(0), ApplicationStatus.UNDER_REVIEW, now.minusDays(1), "Passionate about building products that millions of South Africans use."),
                app("APP-DEMO-15", naledi, internships.get(1), ApplicationStatus.PENDING, now.minusDays(4), null),
                app("APP-DEMO-16", naledi, internships.get(8), ApplicationStatus.PENDING, now, null)
        );
        applicationRepository.saveAll(apps);

        System.out.println(">>> [CareerConnect] Demo data seeded. All demo accounts use password: " + DEMO_PASSWORD);
    }

    private static Company company(String id, String name, String industry, String email, String hash) {
        return new Company.Builder().setCompanyId(id).setName(name).setIndustry(industry)
                .setContactEmail(email).setPassword(hash).build();
    }

    private static Student student(String number, String name, String email, String hash) {
        return new Student.Builder().setStudentNumber(number).setName(name).setEmail(email).setPassword(hash).build();
    }

    private static Profile profile(String id, String studentNumber, String bio, List<String> skills, String resume) {
        return new Profile.Builder().setProfileId(id).setStudentNumber(studentNumber).setBio(bio)
                .setSkills(new ArrayList<>(skills)).setResumeLink(resume).build();
    }

    private static Internship internship(String id, String companyId, String title, String description, String location,
                                         WorkMode mode, int stipend, int months, String field, List<String> skills,
                                         int positions, LocalDateTime deadline, LocalDateTime createdAt) {
        return new Internship.Builder().setInternshipId(id).setCompanyId(companyId).setTitle(title)
                .setDescription(description).setLocation(location).setWorkMode(mode).setStipend(stipend)
                .setDurationMonths(months).setStartDate(LocalDate.now().plusMonths(2).withDayOfMonth(1))
                .setFieldOfStudy(field).setRequiredSkills(new ArrayList<>(skills)).setPositions(positions)
                .setDeadline(deadline).setCreatedAt(createdAt).build();
    }

    private static Application app(String id, Student s, Internship i, ApplicationStatus status,
                                   LocalDateTime applied, String coverLetter) {
        return new Application.Builder().setApplicationId(id).setStudent(s).setInternship(i).setStatus(status)
                .setDateApplied(applied).setUpdatedAt(applied.plusHours(status == ApplicationStatus.PENDING ? 0 : 20))
                .setCoverLetter(coverLetter).build();
    }
}
