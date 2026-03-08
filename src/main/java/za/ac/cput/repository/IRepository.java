package za.ac.cput.repository;

import java.util.List;

/*
 * IRepository.java
 * IRepository class
 * Author: Ebenezer Kouakou (230480152)
 * Date: 08 March 2026
 */
public interface IRepository<T, ID> {
    T create(T t);
    T read(ID id);
    T update(T t);
    boolean delete(ID id);
    List<T> getAll();
}
