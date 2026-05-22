package com.vti.crm.application.usecases.task;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task;
import com.vti.crm.domain.repository.ITaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetTaskUseCase {
    private final ITaskRepository iTaskRepository;
    public PagedResult<Task> excuteGetAll(int page, int size) {
        return iTaskRepository.findAll(page,size);
    }

    public Task excuteGetById(Integer id) {
        return iTaskRepository.findById(id).
                orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Activity với ID: " + id));
    }
}
