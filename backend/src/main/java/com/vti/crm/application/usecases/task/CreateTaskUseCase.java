package com.vti.crm.application.usecases.task;

import com.vti.crm.domain.model.Task;
import com.vti.crm.domain.repository.ITaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateTaskUseCase {
    private final ITaskRepository taskRepository;
    public Task execute(Task task) {
        //gọi để check logic ,gán default,...
        task.initializeForCreation();
        //gọi repos lưu vào db
        return taskRepository.save(task);
    }
}
