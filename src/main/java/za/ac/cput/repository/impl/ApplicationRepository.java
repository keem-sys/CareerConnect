package za.ac.cput.repository.impl;

/*
 * ApplicationRepository.java
 * ApplicationRepository class
 * Author: Mojalefa Mabotja (223227498)
 * Date: 21 March 2026
 */

import za.ac.cput.domain.Application;
import za.ac.cput.repository.IApplicationRepository;

import java.util.*;

public class ApplicationRepository implements IApplicationRepository {

    private static ApplicationRepository repository = null;
    private final Map<String, Application> applicationMap;

    private ApplicationRepository() {
        applicationMap = new HashMap<>();
    }

    public static ApplicationRepository getRepository() {
        if (repository == null) {
            repository = new ApplicationRepository();
        }
        return repository;
    }
    @Override
    public Application create(Application application) {
        applicationMap.put(application.getApplicationId(), application);
        return application;
    }
    @Override
    public Application read(String applicationId) {
        return applicationMap.get(applicationId);
    }
    @Override
    public Application update(Application application) {
        if (applicationMap.containsKey(application.getApplicationId())) {
            applicationMap.put(application.getApplicationId(), application);
            return application;
        }
        return null;
    }
    @Override
    public boolean delete(String applicationId) {
        return applicationMap.remove(applicationId) != null;
    }

    @Override
    public List<Application> getAll(){
        return new ArrayList<>(applicationMap.values());
    }


}
