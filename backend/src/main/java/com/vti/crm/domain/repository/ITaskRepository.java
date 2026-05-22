package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Task;
import com.vti.crm.domain.model.PagedResult;

import java.util.Optional;

public interface ITaskRepository {
    PagedResult<Task> findAll(int page, int size);
    Optional<Task> findById(Integer id);
    Task save(Task Task);
    void deleteById(Integer id);
}
