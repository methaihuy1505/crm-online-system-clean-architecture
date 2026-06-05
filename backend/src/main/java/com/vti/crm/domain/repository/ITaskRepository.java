package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Activity;
import com.vti.crm.domain.model.Task;
import com.vti.crm.domain.model.PagedResult;

import java.util.List;
import java.util.Optional;

public interface ITaskRepository {
    PagedResult<Task> findAll(int page, int size);
    Optional<Task> findById(Integer id);
    Task save(Task Task);
    void deleteById(Integer id);
    PagedResult<Task> advancedSearch(List<Task.RelateType> relateType,
                                     List<Task.Priority> priority,
                                     List<Task.Status> status,
                                     Boolean isOverdue,
                                     int page, int size);
    // Sửa hàm này:
    PagedResult<Task> findAllTasksWithFilter(int page, int size, String keyword, Integer filterUserId);

    PagedResult<Task> advancedSearchWithFilter(List<Task.RelateType> relateType,
                                               List<Task.Priority> priority,
                                               List<Task.Status> status,
                                               Boolean isOverdue,
                                               int page, int size,
                                               Integer filterUserId);
}
