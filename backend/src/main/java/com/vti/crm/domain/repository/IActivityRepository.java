package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Activity;
import com.vti.crm.domain.model.PagedResult;

import java.util.List;
import java.util.Optional;

public interface IActivityRepository {
    // Thêm filterUserId vào các hàm của bạn kia
    PagedResult<Activity> findAll(int page, int size, Integer filterUserId);
    Optional<Activity> findById(Integer id);
    Activity save(Activity activity);
    PagedResult<Activity> findByActivityType(Activity.ActivityType activityType, int page, int size, Integer filterUserId);
    PagedResult<Activity> findByActivityTypeAndParentType(Activity.ActivityType activityType, Activity.ParentType parentType, int page, int size, Integer filterUserId);
    PagedResult<Activity> findByActivityCallTypeAndCallType(Activity.CallType callType, int page, int size, Integer filterUserId);

    void deleteById(Integer id);
    PagedResult<Activity> advancedSearch(
            Activity.ActivityType activityType,
            List<Activity.ParentType> parentTypes,
            Integer parentId,
            Boolean isPriority,
            Boolean isCompleted,
            Activity.CallType callType,
            int page, int size, Integer filterUserId); // Thêm filterUserId
}