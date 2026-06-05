package com.vti.crm.infrastructure.persistence.repository.activity;

import com.vti.crm.infrastructure.persistence.entity.ActivityEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityJpaRepository extends JpaRepository<ActivityEntity, Integer> {
    Optional<ActivityEntity> findByIdAndDeletedAtIsNull(Integer id);

    // 🌟 1. Nâng cấp findAll
    @Query("SELECT a FROM ActivityEntity a WHERE a.deletedAt IS NULL AND " +
            "(:filterUserId IS NULL OR a.createdBy = :filterUserId OR a.taskId IN (SELECT t.id FROM TaskEntity t WHERE t.assignedTo = :filterUserId))")
    Page<ActivityEntity> findAllPaged(@Param("filterUserId") Integer filterUserId, Pageable pageable);

    // 🌟 2. Nâng cấp findByActivityType
    @Query("SELECT a FROM ActivityEntity a WHERE a.activityType = :activityType AND a.deletedAt IS NULL AND " +
            "(:filterUserId IS NULL OR a.createdBy = :filterUserId OR a.taskId IN (SELECT t.id FROM TaskEntity t WHERE t.assignedTo = :filterUserId))")
    Page<ActivityEntity> findByActivityTypePaged(@Param("activityType") ActivityEntity.ActivityType activityType, @Param("filterUserId") Integer filterUserId, Pageable pageable);

    // 🌟 3. Nâng cấp findByActivityTypeAndParentType
    @Query("SELECT a FROM ActivityEntity a WHERE a.activityType = :activityType AND a.parentType = :parentType AND a.deletedAt IS NULL AND " +
            "(:filterUserId IS NULL OR a.createdBy = :filterUserId OR a.taskId IN (SELECT t.id FROM TaskEntity t WHERE t.assignedTo = :filterUserId))")
    Page<ActivityEntity> findByActivityTypeAndParentTypePaged(@Param("activityType") ActivityEntity.ActivityType activityType, @Param("parentType") ActivityEntity.ParentType parentType, @Param("filterUserId") Integer filterUserId, Pageable pageable);

    // 🌟 4. Nâng cấp findByActivityTypeAndCallType (Lưu ý: ActivityType luôn là CALL)
    @Query("SELECT a FROM ActivityEntity a WHERE a.activityType = :activityType AND a.callType = :callType AND a.deletedAt IS NULL AND " +
            "(:filterUserId IS NULL OR a.createdBy = :filterUserId OR a.taskId IN (SELECT t.id FROM TaskEntity t WHERE t.assignedTo = :filterUserId))")
    Page<ActivityEntity> findByActivityTypeAndCallTypePaged(@Param("activityType") ActivityEntity.ActivityType activityType, @Param("callType") ActivityEntity.CallType callType, @Param("filterUserId") Integer filterUserId, Pageable pageable);

    // 🌟 5. Nâng cấp advancedSearch của bạn kia
    @Query("SELECT a FROM ActivityEntity a WHERE " +
            "(:activityType IS NULL OR a.activityType = :activityType) AND " +
            "(:parentTypes IS NULL OR a.parentType IN :parentTypes) AND " +
            "(:parentId IS NULL OR a.parentId = :parentId) AND " +
            "(:isPriority IS NULL OR a.isPriority = :isPriority) AND " +
            "(:isCompleted IS NULL OR a.isCompleted = :isCompleted) AND " +
            "(:callType IS NULL OR a.callType = :callType) AND " +
            "a.deletedAt IS NULL AND " +
            "(:filterUserId IS NULL OR a.createdBy = :filterUserId OR a.taskId IN (SELECT t.id FROM TaskEntity t WHERE t.assignedTo = :filterUserId))")
    Page<ActivityEntity> advancedSearch(
            @Param("activityType") ActivityEntity.ActivityType activityType,
            @Param("parentTypes") List<ActivityEntity.ParentType> parentTypes,
            @Param("parentId") Integer parentId,
            @Param("isPriority") Boolean isPriority,
            @Param("isCompleted") Boolean isCompleted,
            @Param("callType") ActivityEntity.CallType callType,
            @Param("filterUserId") Integer filterUserId, // <--- Thêm dòng này
            Pageable pageable);
}