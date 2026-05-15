package com.vti.crm.infrastructure.persistence.repository.task.tasknote;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task.TaskNote;
import com.vti.crm.domain.repository.Task.ITaskNoteRepository;
import com.vti.crm.infrastructure.persistence.entity.task.TaskNoteEntity;
import com.vti.crm.infrastructure.persistence.mapper.task.TaskNoteInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TaskNoteRepositoryImpl implements ITaskNoteRepository {
    private final TaskNoteJpaRepository taskNoteJpaRepository;
    private final TaskNoteInfraMapper taskNoteInfraMapper;

    @Override
    public PagedResult<TaskNote> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<TaskNoteEntity> pageResult = taskNoteJpaRepository.findByDeletedAtIsNull(pageable);
        List<TaskNote> taskNotes = pageResult.stream()
                .map(taskNoteInfraMapper::toDomain)
                .collect(java.util.stream.Collectors.toList());

        return PagedResult.<TaskNote>builder()
                .data(taskNotes)
                .currentPage(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
    }

    @Override
    public Optional<TaskNote> findById(Integer id) {
        return taskNoteJpaRepository.findByIdAndDeletedAtIsNull(id)
                .map(taskNoteInfraMapper::toDomain);
    }

    @Override
    public TaskNote save(TaskNote taskNote) {
        TaskNoteEntity entity = taskNoteInfraMapper.toEntity(taskNote);
        return taskNoteInfraMapper.toDomain(taskNoteJpaRepository.save(entity));
    }

    @Override
    public void deleteById(Integer id) {
        TaskNoteEntity taskNote = taskNoteJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy TaskNote với ID: " + id));
        taskNote.setDeletedAt(LocalDateTime.now());
        taskNoteJpaRepository.save(taskNote);
    }
}
