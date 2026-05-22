package com.vti.crm.application.usecases.task.tasknote;

import com.vti.crm.domain.model.TaskNote;
import com.vti.crm.domain.repository.ITaskNoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UpdateTaskNoteUseCase {
    private final ITaskNoteRepository iTaskNoteRepository;


    public TaskNote execute(Integer id, TaskNote updatedData) {
        // 1. Lấy dữ liệu cũ từ Database
        TaskNote existingTaskNote = iTaskNoteRepository.findById(id).
                orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Task với ID: " + id));

        // 2. Rich Entity: Gọi thực thể CŨ tự cập nhật nó bằng dữ liệu MỚI
        existingTaskNote.updateForm(existingTaskNote);

        // 3. Lưu xuống Database
        return iTaskNoteRepository.save(existingTaskNote);
    }
}
