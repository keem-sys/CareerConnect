# CareerConnect: Student Internship Management System

**Course:** Applications Development Practice 3 (ADP372S) - Assignment 1  
**Institution:** Cape Peninsula University of Technology (CPUT)  
**Year:** 2026

## Domain Model (UML Class Diagram)
Below is the high-level UML Class diagram depicting the problem domain, our entities, and
their relationships.

![CareerConnect UML Diagram](CareerConnect_UML_Diagram.jpeg)

## Project Overview
CareerConnect is an application designed to bridge the gap between students and the industry. 
The system allows students to create professional profiles, 
browse available internships, apply, and track their application statuses. 
Conversely, system administrators and employers can post new internship opportunities and 
seamlessly manage incoming applications.


##  Team Members & Assigned Entities
This project was developed collaboratively using Git, GitHub, and Agile methodologies 
(Milestones & Issues). 
Each team member was responsible for the Domain-Driven Design (DDD) Entity, 
Factory, and Repository of their assigned domain.

## Features
- **Students:** search and filter internships (keyword, location, work mode, field, paid only), apply with a cover letter, track every application through a status pipeline, withdraw, and build a profile with completeness tracking.
- **Employers:** post detailed internships (stipend, work mode, duration, start date, skills, positions), see a hiring dashboard, and move applicants through *Submitted → Under review → Shortlisted → Offer / Not selected*.
- **Admins:** see platform-wide stats (placement rate, applications by status) and manage students, companies and internships.
- **Security:** Spring Security with stateless JWT, BCrypt password hashing, role-based access (`STUDENT`, `COMPANY`, `ADMIN`) and ownership checks on every sensitive endpoint.
- **Business rules:** application status transitions are enforced on the server (for example, a rejected application can't become an offer); you can't apply twice or after the deadline; response DTOs never expose passwords.

## Tech stack
| Layer | Tech |
|---|---|
| Backend | Java 21, Spring Boot 4, Spring Security, JPA/Hibernate, MySQL (H2 for demo) |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router, Axios, lucide-react |
| Tests | JUnit 5, Mockito, Spring MockMvc |

## Running locally

### 1. Backend
The backend needs a JWT secret (Base64, at least 256 bits):
```powershell
$env:JWT_SECRET='dGVzdC1zZWNyZXQta2V5LWZvci1jYXJlZXJjb25uZWN0LWRlbW8tMTIzNDU2Nzg5MA=='
```
**Option A: MySQL** (default profile; needs MySQL on `localhost:3306`, credentials in `application.properties`):
```powershell
mvn spring-boot:run
```
**Option B: no database install** (in-memory H2; data resets on restart):
```powershell
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
```
The API runs on `http://localhost:8080`.

### 2. Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

## Demo data & accounts
With `careerconnect.demo.seed=true` (the default), the app seeds 6 South African companies, 14 internships, 5 students and 16 applications covering every status. Seeding only runs once.

| Role | Login | Password |
|---|---|---|
| Student | `230480152@mycput.ac.za` (Thandiwe Mokoena) | `Demo@1234` |
| Employer | `careers@takealot.demo` (Takealot Group) | `Demo@1234` |
| Admin | `admin@cput.ac.za` | `adminpass123` |

The login page also has one-click demo account buttons.

## Suggested demo script (about 7 minutes)
1. **Landing page (guest):** live platform stats, featured internships, search "Java" in "Cape Town".
2. **Browse:** filter by *Remote* and *Paid only*, sort by stipend, open a listing to show its details.
3. **Student** (Thandiwe): dashboard stats, profile completeness and recommendations → apply to an internship with a cover letter → *My applications* shows the status tracker → withdraw one.
4. **Employer** (Takealot): dashboard pipeline → *Post internship* (live preview) → *Applicants*: open Thandiwe's application, read the cover letter, **Shortlist** → **Make offer**.
5. **Student again:** the application now shows *Offer*.
6. **Admin:** platform overview (placement rate, status breakdown) and the management tables.
7. **Security talking points:** JWT + BCrypt, role guards, server-side status-transition rules, DTOs that hide passwords.

---
*Built with Java, Maven, and JUnit 5 using Test-Driven Development (TDD).*