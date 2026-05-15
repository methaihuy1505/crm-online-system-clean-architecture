package com.vti.crm.application.usecases.task;

import com.vti.crm.domain.repository.Task.ITaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteTaskUseCase {
    private final ITaskRepository iTaskRepository;

    public void excute(Integer id) {
            iTaskRepository.deleteById(id);
        }
}
