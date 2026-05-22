package com.vti.crm.application.usecases.task.tasknote;

import com.vti.crm.domain.model.TaskNote;
import com.vti.crm.domain.repository.ITaskNoteRepository;
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
