package com.vti.crm.application.usecases.task.tasknote;

import com.vti.crm.domain.model.Task.Task;
import com.vti.crm.domain.model.Task.TaskNote;
import com.vti.crm.domain.repository.Task.ITaskNoteRepository;
import com.vti.crm.domain.repository.Task.ITaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateTaskNoteUseCase {
    private final ITaskNoteRepository iTaskNoteRepository;
    public TaskNote execute(TaskNote taskNote) {
        //gọi để check logic ,gán default,...
        taskNote.initializeForCreation();
        //gọi repos lưu vào db
        return iTaskNoteRepository.save(taskNote);
    }
}
