package com.vti.crm.infrastructure.persistence.repository.activity;

import com.vti.crm.infrastructure.persistence.entity.activity.ActivityEntity;
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
    Page<ActivityEntity> findByDeletedAtIsNull(Pageable pageable);
    Optional<ActivityEntity> findByIdAndDeletedAtIsNull(Integer id);
    Page<ActivityEntity> findByActivityTypeAndDeletedAtIsNull(ActivityEntity.ActivityType activityType, Pageable pageable);
    Page<ActivityEntity> findByActivityTypeAndParentTypeAndDeletedAtIsNull(ActivityEntity.ActivityType activityType,ActivityEntity.ParentType parentType,Pageable pageable);
    Page<ActivityEntity> findByActivityTypeAndCallTypeAndDeletedAtIsNull(ActivityEntity.ActivityType activityType, ActivityEntity.CallType callType,Pageable pageable);

    @Query("SELECT a FROM ActivityEntity a WHERE " +
            "(:activityType IS NULL OR a.activityType = :activityType) AND " +
            "(:parentTypes IS NULL OR a.parentType IN :parentTypes) AND " + // Sử dụng IN thay vì =
            "(:isPriority IS NULL OR a.isPriority = :isPriority) AND " +
            "(:isCompleted IS NULL OR a.isCompleted = :isCompleted) AND " +
            "(:callType IS NULL OR a.callType = :callType) AND " +
            "a.deletedAt IS NULL")
    Page<ActivityEntity> advancedSearch(
            @Param("activityType") ActivityEntity.ActivityType activityType,
            @Param("parentTypes") List<ActivityEntity.ParentType> parentTypes, // Nhận vào List
            @Param("isPriority") Boolean isPriority,
            @Param("isCompleted") Boolean isCompleted,
            @Param("callType") ActivityEntity.CallType callType,
            Pageable pageable);
}
