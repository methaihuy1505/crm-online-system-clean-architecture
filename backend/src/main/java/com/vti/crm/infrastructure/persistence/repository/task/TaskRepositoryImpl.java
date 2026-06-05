package com.vti.crm.infrastructure.persistence.repository.task;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task;
import com.vti.crm.domain.repository.ITaskRepository;
import com.vti.crm.infrastructure.persistence.entity.TaskEntity;
import com.vti.crm.infrastructure.persistence.mapper.TaskInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; // 🌟 IMPORT SORT
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Repository
@RequiredArgsConstructor
public class TaskRepositoryImpl implements ITaskRepository {
    private final TaskJpaRepository taskJpaRepository;
    private final TaskInfraMapper taskInfraMapper;

    @Override
    public PagedResult<Task> findAll(int page, int size) {
        // 🌟 ÉP SORT CỨNG CHO HÀM CŨ
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<TaskEntity> pageResult = taskJpaRepository.findByDeletedAtIsNull(pageable);
        List<Task> tasks = pageResult.stream()
                .map(taskInfraMapper::toDomain)
                .collect(java.util.stream.Collectors.toList());

        return PagedResult.<Task>builder()
                .data(tasks).currentPage(pageResult.getNumber()).pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages())
                .build();
    }

    @Override
    public Optional<Task> findById(Integer id) {
        return taskJpaRepository.findByIdAndDeletedAtIsNull(id).map(taskInfraMapper::toDomain);
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

    @Override
    public PagedResult<Task> advancedSearch(List<Task.RelateType> relateType, List<Task.Priority> priority, List<Task.Status> status, Boolean isOverdue, int page, int size) {
        // 🌟 ÉP SORT CỨNG CHO HÀM TÌM KIẾM CŨ
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        List<TaskEntity.RelateType> dbRelateTypes = (relateType == null || relateType.isEmpty()) ? null :
                relateType.stream().map(rt -> TaskEntity.RelateType.valueOf(rt.name())).collect(Collectors.toList());

        List<TaskEntity.Priority> dbPriorities = (priority == null || priority.isEmpty()) ? null :
                priority.stream().map(p -> TaskEntity.Priority.valueOf(p.name())).collect(Collectors.toList());

        List<TaskEntity.Status> dbStatuses = (status == null || status.isEmpty()) ? null :
                status.stream().map(s -> TaskEntity.Status.valueOf(s.name())).collect(Collectors.toList());

        Page<TaskEntity> pageResult = taskJpaRepository.advancedSearch(
                dbRelateTypes, dbPriorities, dbStatuses, isOverdue, pageable
        );

        List<Task> tasks = pageResult.stream()
                .map(taskInfraMapper::toDomain).collect(Collectors.toList());

        return PagedResult.<Task>builder()
                .data(tasks).currentPage(pageResult.getNumber()).pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages())
                .build();
    }

    // ================== CÁC HÀM MỚI ĐÃ ĐƯỢC TRIỂN KHAI ==================

    @Override
    public PagedResult<Task> findAllTasksWithFilter(int page, int size, String keyword, Integer filterUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        // 🌟 TRUYỀN KEYWORD XUỐNG JPA
        Page<TaskEntity> pageResult = taskJpaRepository.findAllTasksWithFilter(keyword, filterUserId, pageable);

        List<Task> tasks = pageResult.stream().map(taskInfraMapper::toDomain).collect(Collectors.toList());
        return PagedResult.<Task>builder()
                .data(tasks).currentPage(pageResult.getNumber()).pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages())
                .build();
    }

    @Override
    public PagedResult<Task> advancedSearchWithFilter(String keyword,List<Task.RelateType> relateType, List<Task.Priority> priority, List<Task.Status> status, Boolean isOverdue, int page, int size, Integer filterUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        List<TaskEntity.RelateType> dbRelateTypes = (relateType == null || relateType.isEmpty()) ? null :
                relateType.stream().map(rt -> TaskEntity.RelateType.valueOf(rt.name())).collect(Collectors.toList());

        List<TaskEntity.Priority> dbPriorities = (priority == null || priority.isEmpty()) ? null :
                priority.stream().map(p -> TaskEntity.Priority.valueOf(p.name())).collect(Collectors.toList());

        List<TaskEntity.Status> dbStatuses = (status == null || status.isEmpty()) ? null :
                status.stream().map(s -> TaskEntity.Status.valueOf(s.name())).collect(Collectors.toList());


        Page<TaskEntity> pageResult = taskJpaRepository.advancedSearchWithFilter(
                keyword, dbRelateTypes, dbPriorities, dbStatuses, isOverdue, filterUserId, pageable
        );

        List<Task> tasks = pageResult.stream()
                .map(taskInfraMapper::toDomain).collect(Collectors.toList());

        return PagedResult.<Task>builder()
                .data(tasks).currentPage(pageResult.getNumber()).pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages())
                .build();
    }
}