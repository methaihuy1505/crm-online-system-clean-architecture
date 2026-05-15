package com.vti.crm.application.usecases.task.tasknote;

import com.vti.crm.domain.repository.Task.ITaskNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteTaskNoteUseCase {
    private final ITaskNoteRepository iTaskNoteRepository;

    public void excute(Integer id) {
            iTaskNoteRepository.deleteById(id);
        }
}
