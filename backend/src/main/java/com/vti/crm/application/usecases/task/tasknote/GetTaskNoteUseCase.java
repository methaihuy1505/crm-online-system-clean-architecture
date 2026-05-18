package com.vti.crm.application.usecases.task.tasknote;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task.TaskNote;
import com.vti.crm.domain.repository.Task.ITaskNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetTaskNoteUseCase {
    private final ITaskNoteRepository iTaskNoteRepository;
    public PagedResult<TaskNote> excuteGetAll(int page, int size) {
        return iTaskNoteRepository.findAll(page,size);
    }

    public TaskNote excuteGetById(Integer id) {
        return iTaskNoteRepository.findById(id).
                orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Activity với ID: " + id));
    }
}
