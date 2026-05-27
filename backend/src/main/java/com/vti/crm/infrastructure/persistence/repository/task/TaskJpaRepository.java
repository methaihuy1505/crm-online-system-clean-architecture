package com.vti.crm.infrastructure.persistence.repository.task;

import com.vti.crm.infrastructure.persistence.entity.TaskEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TaskJpaRepository extends JpaRepository<TaskEntity, Integer> {
    Page<TaskEntity> findByDeletedAtIsNull(Pageable pageable);
    Optional<TaskEntity> findByIdAndDeletedAtIsNull(Integer id);

    @Query("SELECT t FROM TaskEntity t WHERE " +
            "(:relateType IS NULL OR t.relateType = :relateType) AND " +
            "(:priority IS NULL OR t.priority = :priority) AND " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:isOverdue IS NULL OR t.isOverdue = :isOverdue)")
    Page<TaskEntity> advancedSearch(
            @Param("relateType") TaskEntity.RelateType relateType,
            @Param("priority") TaskEntity.Priority priority,
            @Param("status") TaskEntity.Status status,
            @Param("isOverdue") Boolean isOverdue,
            Pageable pageable
    );
}
