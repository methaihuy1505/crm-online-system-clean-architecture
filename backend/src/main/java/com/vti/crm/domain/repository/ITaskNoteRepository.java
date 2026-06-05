package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.TaskNote;

import java.util.Optional;

public interface ITaskNoteRepository {
    PagedResult<TaskNote> findAll(int page, int size);
    Optional<TaskNote> findById(Integer id);

    PagedResult<TaskNote> findByTaskId(Integer taskId, int page, int size);

    TaskNote save(TaskNote taskNote);

    void deleteById(Integer id);
}
