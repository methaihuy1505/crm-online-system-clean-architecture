package com.vti.crm.domain.repository.Task;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task.TaskNote;

import java.util.Optional;

public interface ITaskNoteRepository {
    PagedResult<TaskNote> findAll(int page, int size);
    Optional<TaskNote> findById(Integer id);

    TaskNote save(TaskNote taskNote);

    void deleteById(Integer id);
}