package com.vti.crm.infrastructure.persistence.repository.activity;

import com.vti.crm.domain.model.Activity;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.repository.IActivityRepository;
import com.vti.crm.infrastructure.persistence.entity.ActivityEntity;
import com.vti.crm.infrastructure.persistence.mapper.ActivityInfraMapper;
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
public class ActivityRepositoryImpl implements IActivityRepository {

    private final ActivityJpaRepository activityJpaRepository;
    private final ActivityInfraMapper activityInfraMapper;

    @Override
    public PagedResult<Activity> findAll(int page, int size, Integer filterUserId) {
        // 🌟 Ép cứng SORT DESC
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<ActivityEntity> pageResult = activityJpaRepository.findAllPaged(filterUserId, pageable);

        List<Activity> activities = pageResult.stream().map(activityInfraMapper::toDomain).collect(Collectors.toList());
        return PagedResult.<Activity>builder()
                .data(activities).currentPage(pageResult.getNumber()).pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages()).build();
    }

    @Override
    public Optional<Activity> findById(Integer id) {
        return activityJpaRepository.findByIdAndDeletedAtIsNull(id).map(activityInfraMapper::toDomain);
    }

    @Override
    public Activity save(Activity activity) {
        ActivityEntity entity = activityInfraMapper.toEntity(activity);
        return activityInfraMapper.toDomain(activityJpaRepository.save(entity));
    }

    @Override
    public PagedResult<Activity> findByActivityType(Activity.ActivityType activityType, int page, int size, Integer filterUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        ActivityEntity.ActivityType dbActivityType = ActivityEntity.ActivityType.valueOf(activityType.name());

        Page<ActivityEntity> pageResult = activityJpaRepository.findByActivityTypePaged(dbActivityType, filterUserId, pageable);

        List<Activity> activities = pageResult.stream().map(activityInfraMapper::toDomain).collect(Collectors.toList());
        return PagedResult.<Activity>builder()
                .data(activities).currentPage(pageResult.getNumber()).pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages()).build();
    }

    @Override
    public PagedResult<Activity> findByActivityTypeAndParentType(Activity.ActivityType activityType, Activity.ParentType parentType, int page, int size, Integer filterUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        ActivityEntity.ActivityType dbActivityType = ActivityEntity.ActivityType.valueOf(activityType.name());
        ActivityEntity.ParentType dbparentType = ActivityEntity.ParentType.valueOf(parentType.name());

        Page<ActivityEntity> pageResult = activityJpaRepository.findByActivityTypeAndParentTypePaged(dbActivityType, dbparentType, filterUserId, pageable);

        List<Activity> activities = pageResult.stream().map(activityInfraMapper::toDomain).collect(Collectors.toList());
        return PagedResult.<Activity>builder()
                .data(activities).currentPage(pageResult.getNumber()).pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages()).build();
    }

    @Override
    public PagedResult<Activity> findByActivityCallTypeAndCallType(Activity.CallType callType, int page, int size, Integer filterUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        ActivityEntity.ActivityType dbActivityType = ActivityEntity.ActivityType.valueOf("CALL");
        ActivityEntity.CallType dbCallType = ActivityEntity.CallType.valueOf(callType.name());

        Page<ActivityEntity> pageResult = activityJpaRepository.findByActivityTypeAndCallTypePaged(dbActivityType, dbCallType, filterUserId, pageable);

        List<Activity> activities = pageResult.stream().map(activityInfraMapper::toDomain).collect(Collectors.toList());
        return PagedResult.<Activity>builder()
                .data(activities).currentPage(pageResult.getNumber()).pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages()).build();
    }

    @Override
    public void deleteById(Integer id) {
        ActivityEntity activity = activityJpaRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy hoạt động với ID: " + id));
        activity.setDeletedAt(LocalDateTime.now());
        activityJpaRepository.save(activity);
    }

    @Override
    public PagedResult<Activity> advancedSearch(
            Activity.ActivityType activityType, List<Activity.ParentType> parentTypes,
            Integer parentId, Boolean isPriority, Boolean isCompleted,
            Activity.CallType callType, int page, int size, Integer filterUserId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        ActivityEntity.ActivityType dbActivityType = (activityType != null) ? ActivityEntity.ActivityType.valueOf(activityType.name()) : null;
        List<ActivityEntity.ParentType> dbParentTypes = null;
        if (parentTypes != null && !parentTypes.isEmpty()) {
            dbParentTypes = parentTypes.stream().map(p -> ActivityEntity.ParentType.valueOf(p.name())).collect(Collectors.toList());
        }
        ActivityEntity.CallType dbCallType = (callType != null) ? ActivityEntity.CallType.valueOf(callType.name()) : null;

        Page<ActivityEntity> pageResult = activityJpaRepository.advancedSearch(
                dbActivityType, dbParentTypes, parentId, isPriority, isCompleted, dbCallType, filterUserId, pageable);

        List<Activity> activities = pageResult.stream().map(activityInfraMapper::toDomain).collect(Collectors.toList());
        return PagedResult.<Activity>builder()
                .data(activities).currentPage(pageResult.getNumber()).pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages()).build();
    }
}