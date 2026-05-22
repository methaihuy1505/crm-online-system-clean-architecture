package com.vti.crm.application.usecases.task;

import com.vti.crm.domain.model.Task;
import com.vti.crm.domain.repository.ITaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UpdateTaskUseCase {
    private final ITaskRepository iTaskRepository;


    public Task execute(Integer id, Task updatedData) {
        // 1. Lấy dữ liệu cũ từ Database
        Task existingTask = iTaskRepository.findById(id).
                orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Task với ID: " + id));

        // 2. Rich Entity: Gọi thực thể CŨ tự cập nhật nó bằng dữ liệu MỚI
        existingTask.updateFrom(updatedData);

        // 3. Lưu xuống Database
        return iTaskRepository.save(existingTask);
    }
}
