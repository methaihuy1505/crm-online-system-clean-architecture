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
    @Override
    public PagedResult<Task> advancedSearch(Task.RelateType relateType,
                                            Task.Priority priority,
                                            Task.Status status,
                                            Boolean isOverdue,
                                            int page,
                                            int size) {

        // Khởi tạo đối tượng phân trang (Pageable) nhận từ Frontend gửi lên
        Pageable pageable = PageRequest.of(page, size);

        // 1. Ánh xạ (Mapping) RelateType sang Enum tương ứng của Entity database
        TaskEntity.RelateType dbRelateType = (relateType != null)
                ? TaskEntity.RelateType.valueOf(relateType.name()) : null;

        // 2. Ánh xạ (Mapping) Priority sang Enum tương ứng của Entity database
        TaskEntity.Priority dbPriority = (priority != null)
                ? TaskEntity.Priority.valueOf(priority.name()) : null;

        // 3. Ánh xạ (Mapping) Status sang Enum tương ứng của Entity database
        TaskEntity.Status dbStatus = (status != null)
                ? TaskEntity.Status.valueOf(status.name()) : null;

        // 4. Gọi tầng Repository xử lý câu lệnh SQL động/Specification truyền kèm pageable
        Page<TaskEntity> pageResult = taskJpaRepository.advancedSearch(
                dbRelateType,
                dbPriority,
                dbStatus,
                isOverdue,
                pageable
        );

        // 5. Chuyển đổi mảng các Thực thể (Entities) kết quả sang mô hình Domain chuẩn
        List<Task> tasks = pageResult.stream()
                .map(taskInfraMapper::toDomain)
                .collect(Collectors.toList());

        // 6. Đóng gói kết quả DTO Pageable trả về cho tầng API
        return PagedResult.<Task>builder()
                .data(tasks)
                .currentPage(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
    }
}
