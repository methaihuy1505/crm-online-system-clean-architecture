package com.vti.crm.application.usecases.activity;

import com.vti.crm.domain.model.Activity.Activity;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.repository.Activity.IActivityRepository;
import com.vti.crm.interfaces.dto.request.activity.ActivityAdvancedSearchRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetActivityUseCase {
    private final IActivityRepository activityRepository;
    public PagedResult<Activity> excuteGetAll(int page, int size) {
        return activityRepository.findAll(page,size);
    }

    public Activity excuteGetById(Integer id) {
        return activityRepository.findById(id).
                orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Activity với ID: " + id));
    }
    public PagedResult<Activity> excuteGetByActivityType(Activity.ActivityType activityType,int page,int size) {
        return activityRepository.findByActivityType(activityType,page,size);
    }
    public PagedResult<Activity> excuteGetByActivityTypeAndParentType(Activity.ActivityType activityType,
                                                               Activity.ParentType parentType,int page,int size) {
        return activityRepository.findByActivityTypeAndParentType(activityType,parentType,page,size);
    }
    public PagedResult<Activity> excuteGetByActivityCallTypeAndCallType(
                                                             Activity.CallType callType,int page,int size)
    {
        return activityRepository.findByActivityCallTypeAndCallType(callType,page,size);
    }

    public PagedResult<Activity> executeAdvancedSearch(ActivityAdvancedSearchRequest request, int page, int size) {
        return activityRepository.advancedSearch(
                request.getActivityType(),
                request.getParentTypes(),
                request.getIsPriority(),
                request.getIsCompleted(),
                request.getCallType(),
                page,
                size
        );
    }
}
