package za.ac.cput.service;

import za.ac.cput.domain.Profile;

import java.util.List;
import java.util.Optional;

/*
 * IProfileService.java
 * IProfileService interface
 * Author: Oratilwe Komane (230716873)
 * Date: 11 March 2026
 */
public interface IProfileService extends IService<Profile, String> {
    Optional<Profile> getProfileByStudentNumber(String studentNumber);
}