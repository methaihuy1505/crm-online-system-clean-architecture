package com.vti.crm.infrastructure.persistence.repository.task;

import com.vti.crm.infrastructure.persistence.entity.TaskEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskJpaRepository extends JpaRepository<TaskEntity, Integer> {
    Page<TaskEntity> findByDeletedAtIsNull(Pageable pageable);
    Optional<TaskEntity> findByIdAndDeletedAtIsNull(Integer id);

    @Query("SELECT t FROM TaskEntity t WHERE " +
            "(:relateType IS NULL OR t.relateType IN :relateType) AND " +
            "(:priority IS NULL OR t.priority IN :priority) AND " +
            "(:status IS NULL OR t.status IN :status) AND " +
            "(:isOverdue IS NULL OR t.isOverdue = :isOverdue)")
    Page<TaskEntity> advancedSearch(
            @Param("relateType") List<TaskEntity.RelateType> relateType,
            @Param("priority") List<TaskEntity.Priority> priority,
            @Param("status") List<TaskEntity.Status> status,
            @Param("isOverdue") Boolean isOverdue,
            Pageable pageable
    );

    // ================== CÁC HÀM MỚI CHO PHÂN QUYỀN ==================

    @Query("SELECT t FROM TaskEntity t WHERE t.deletedAt IS NULL AND " +
            "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:filterUserId IS NULL OR t.assignedTo = :filterUserId OR t.createdBy = :filterUserId)")
    Page<TaskEntity> findAllTasksWithFilter(
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("filterUserId") Integer filterUserId,
            Pageable pageable);

    @Query("SELECT t FROM TaskEntity t WHERE t.deletedAt IS NULL AND " +
            "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:relateType IS NULL OR t.relateType IN :relateType) AND " +
            "(:priority IS NULL OR t.priority IN :priority) AND " +
            "(:status IS NULL OR t.status IN :status) AND " +
            "(:isOverdue IS NULL OR t.isOverdue = :isOverdue) AND " +
            "(:filterUserId IS NULL OR t.assignedTo = :filterUserId OR t.createdBy = :filterUserId)")
    Page<TaskEntity> advancedSearchWithFilter(
            @Param("keyword") String keyword,
            @Param("relateType") List<TaskEntity.RelateType> relateType,
            @Param("priority") List<TaskEntity.Priority> priority,
            @Param("status") List<TaskEntity.Status> status,
            @Param("isOverdue") Boolean isOverdue,
            @Param("filterUserId") Integer filterUserId,
            Pageable pageable
    );
}