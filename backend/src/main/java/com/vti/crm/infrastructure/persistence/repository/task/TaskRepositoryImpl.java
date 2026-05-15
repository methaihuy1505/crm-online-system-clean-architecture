package com.vti.crm.infrastructure.persistence.repository.task;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task.Task;
import com.vti.crm.domain.repository.Task.ITaskRepository;
import com.vti.crm.infrastructure.persistence.entity.task.TaskEntity;
import com.vti.crm.infrastructure.persistence.mapper.task.TaskInfraMapper;
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
public class TaskRepositoryImpl implements ITaskRepository {
    private final TaskJpaRepository taskJpaRepository;
    private final TaskInfraMapper taskInfraMapper;

    @Override
    public PagedResult<Task> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<TaskEntity> pageResult = taskJpaRepository.findByDeletedAtIsNull(pageable);
        List<Task> tasks = pageResult.stream()
                .map(taskInfraMapper::toDomain)
                .collect(java.util.stream.Collectors.toList());

        return PagedResult.<Task>builder()
                .data(tasks)
                .currentPage(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
    }

    @Override
    public Optional<Task> findById(Integer id) {
        return taskJpaRepository.findByIdAndDeletedAtIsNull(id)
                .map(taskInfraMapper::toDomain);
    }

    @Override
    public Task save(Task task) {
        TaskEntity entity = taskInfraMapper.toEntity(task);
        return taskInfraMapper.toDomain(taskJpaRepository.save(entity));
    }

    @Override
    public void deleteById(Integer id) {
        TaskEntity task = taskJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Task với ID: " + id));
        task.setDeletedAt(LocalDateTime.now());
        taskJpaRepository.save(task);
    }
}
