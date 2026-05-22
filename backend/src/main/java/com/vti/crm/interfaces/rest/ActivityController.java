package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.activity.CreateActivityUseCase;
import com.vti.crm.application.usecases.activity.DeleteActivityUseCase;
import com.vti.crm.application.usecases.activity.GetActivityUseCase;
import com.vti.crm.application.usecases.activity.UpdateActivityUseCase;
import com.vti.crm.domain.model.Activity;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.interfaces.dto.request.activity.ActivityAdvancedSearchRequest;
import com.vti.crm.interfaces.dto.request.activity.ActivityCreationRequest;
import com.vti.crm.interfaces.dto.request.activity.ActivityUpdateRequest;
import com.vti.crm.interfaces.dto.response.activity.ActivityResponseDTO;
import com.vti.crm.interfaces.mapper.ActivityWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final GetActivityUseCase getActivityUseCase;
    private final CreateActivityUseCase createActivityUseCase;
    private final UpdateActivityUseCase updateActivityUseCase;
    private final DeleteActivityUseCase deleteActivityUseCase;

    // Inject MapStruct Mapper
    private final ActivityWebMapper mapper;

    @GetMapping
    public PagedResult<ActivityResponseDTO> getAllActivities(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        PagedResult<Activity> activitiesDomain = getActivityUseCase.excuteGetAll(page,size);
        return mapper.toResponseList(activitiesDomain);
    }

    @GetMapping("/{id}")
    public ActivityResponseDTO getActivityById(@PathVariable Integer id) {
        Activity activity = getActivityUseCase.excuteGetById(id);
        return mapper.toResponse(activity);
    }
    @GetMapping("/activity-type/{activityType}")
    public PagedResult<ActivityResponseDTO> getActivitiesByActivityType(@PathVariable Activity.ActivityType activityType
                                                                ,@RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "10") int size)
    {
        PagedResult<Activity> activitiesDomain = getActivityUseCase.excuteGetByActivityType(activityType,page,size);
        return mapper.toResponseList(activitiesDomain);
    }
    @GetMapping("/activity-type/{activityType}/parent-type/{parentType}")
    public PagedResult<ActivityResponseDTO> getActivitiesByActivityTypeAndParentType(@PathVariable Activity.ActivityType activityType,
                                                                              @PathVariable Activity.ParentType parentType,
                                                                              @RequestParam(defaultValue = "0") int page,
                                                                              @RequestParam(defaultValue = "10") int size)
    {
        PagedResult<Activity> activitiesDomain = getActivityUseCase.excuteGetByActivityTypeAndParentType(activityType,parentType,page,size);
        return mapper.toResponseList(activitiesDomain);
    }
    @GetMapping("/activity-type/callType/{callType}")
    public PagedResult<ActivityResponseDTO> getByActivityCallTypeAndCallType(@PathVariable Activity.CallType callType,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size)
    {
        PagedResult<Activity> activitiesDomain = getActivityUseCase.excuteGetByActivityCallTypeAndCallType(callType,page,size);
        return mapper.toResponseList(activitiesDomain);
    }
    @GetMapping("/advanced-search")
    public PagedResult<ActivityResponseDTO> advancedSearch(
            @ModelAttribute ActivityAdvancedSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        //ở domain thêm advancedSearch có các tiêu chí để map
        PagedResult<Activity> activitiesDomain = getActivityUseCase.executeAdvancedSearch(
                request,
                page,
                size
        );
        return mapper.toResponseList(activitiesDomain);
    }
    @PostMapping
    public ActivityResponseDTO createActivity(@RequestBody ActivityCreationRequest request) {
        // 1. Map Request -> Domain
        Activity activityToCreate = mapper.toDomain(request);

        // 2. Chuyền cả cục Domain vào UseCase
        Activity createdActivity = createActivityUseCase.execute(activityToCreate);

        // 3. Map Domain -> Response
        return mapper.toResponse(createdActivity);
    }

    @PutMapping("/{id}")
    public ActivityResponseDTO updateActivity(@PathVariable Integer id, @RequestBody ActivityUpdateRequest request) {
        // 1. Map Request -> Domain
        Activity activityToUpdate = mapper.toDomain(request);

        // 2. UseCase xử lý update
        Activity updatedActivity = updateActivityUseCase.execute(id, activityToUpdate);

        // 3. Map Domain -> Response
        return mapper.toResponse(updatedActivity);
    }

    @DeleteMapping("/{id}")
    public String deleteActivity(@PathVariable Integer id) {
        deleteActivityUseCase.excute(id);
        return "Delete completed";
    }
}