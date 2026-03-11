package za.ac.cput.repository.impl;

import za.ac.cput.domain.Profile;
import za.ac.cput.repository.IProfileRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * ProfileRepositoryImpl.java
 * Profile repository implementation class
 * Author: Oratilwe Komane (230716873)
 * Date: 11 March 2026
 */
public class ProfileRepositoryImpl implements IProfileRepository {
    private static ProfileRepositoryImpl instance;
    private final Map<String, Profile> store = new HashMap<>();

    private ProfileRepositoryImpl() {}

    public static ProfileRepositoryImpl getInstance() {
        if (instance == null) {
            instance = new ProfileRepositoryImpl();
        }
        return instance;
    }

    @Override
    public Profile create(Profile profile) {
        store.put(profile.getProfileId(), profile);
        return profile;
    }

    @Override
    public Profile read(String profileId) {
        return store.get(profileId);
    }

    @Override
    public Profile update(Profile profile) {
        if (store.containsKey(profile.getProfileId())) {
            store.put(profile.getProfileId(), profile);
            return profile;
        }
        return null;
    }

    @Override
    public boolean delete(String profileId) {
        if (store.containsKey(profileId)) {
            store.remove(profileId);
            return true;
        }
        return false;
    }

    @Override
    public List<Profile> getAll() {
        return new ArrayList<>(store.values());
    }
}