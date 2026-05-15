package com.vti.crm.domain.repository.Activity;

import com.vti.crm.domain.model.Activity.Activity;
import com.vti.crm.domain.model.PagedResult;

import java.util.List;
import java.util.Optional;

public interface IActivityRepository {
    PagedResult<Activity> findAll(int page, int size);
    Optional<Activity> findById(Integer id);
    Activity save(Activity activity);
    PagedResult<Activity> findByActivityType(Activity.ActivityType activityType,int page,int size);
    PagedResult<Activity> findByActivityTypeAndParentType(Activity.ActivityType activityType,Activity.ParentType parentType,int page,int size);
    PagedResult<Activity> findByActivityCallTypeAndCallType(Activity.CallType callType,int page,int size);
    void deleteById(Integer id);
    PagedResult<Activity> advancedSearch(Activity.ActivityType activityType,
                                         List<Activity.ParentType> parentTypes,
                                         Boolean isPriority, Boolean isCompleted,
                                         Activity.CallType callType,
                                         int page,int size);
}
