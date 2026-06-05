package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.activity.CreateActivityUseCase;
import com.vti.crm.application.usecases.activity.DeleteActivityUseCase;
import com.vti.crm.application.usecases.activity.GetActivityUseCase;
import com.vti.crm.application.usecases.activity.UpdateActivityUseCase;
import com.vti.crm.domain.model.Activity;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.infrastructure.security.CustomUserDetails; // 🌟 IMPORT CUSTOM USER DETAILS
import com.vti.crm.interfaces.dto.request.activity.ActivityAdvancedSearchRequest;
import com.vti.crm.interfaces.dto.request.activity.ActivityCreationRequest;
import com.vti.crm.interfaces.dto.request.activity.ActivityUpdateRequest;
import com.vti.crm.interfaces.dto.response.activity.ActivityDetailsResponseDTO;
import com.vti.crm.interfaces.dto.response.activity.ActivityResponseDTO;
import com.vti.crm.interfaces.mapper.ActivityWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // 🌟 IMPORT ANNOTATION NÀY
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('activities.view')")
public class ActivityController {

    private final GetActivityUseCase getActivityUseCase;
    private final CreateActivityUseCase createActivityUseCase;
    private final UpdateActivityUseCase updateActivityUseCase;
    private final DeleteActivityUseCase deleteActivityUseCase;
    private final ActivityWebMapper mapper;

    @GetMapping
    public PagedResult<ActivityDetailsResponseDTO> getAllActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) { // 🌟 Bơm Token vào đây
        return getActivityUseCase.excuteGetAll(page, size, currentUser.getId(), currentUser.getRoleId());
    }

    @GetMapping("/{id}")
    public ActivityDetailsResponseDTO getActivityById(@PathVariable Integer id) {
        return getActivityUseCase.excuteGetById(id);
    }

    @GetMapping("/activity-type/{activityType}")
    public PagedResult<ActivityDetailsResponseDTO> getActivitiesByActivityType(
            @PathVariable Activity.ActivityType activityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return getActivityUseCase.excuteGetByActivityType(activityType, page, size, currentUser.getId(), currentUser.getRoleId());
    }

    @GetMapping("/activity-type/{activityType}/parent-type/{parentType}")
    public PagedResult<ActivityDetailsResponseDTO> getActivitiesByActivityTypeAndParentType(
            @PathVariable Activity.ActivityType activityType,
            @PathVariable Activity.ParentType parentType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return getActivityUseCase.excuteGetByActivityTypeAndParentType(activityType, parentType, page, size, currentUser.getId(), currentUser.getRoleId());
    }

    @GetMapping("/activity-type/callType/{callType}")
    public PagedResult<ActivityDetailsResponseDTO> getByActivityCallTypeAndCallType(
            @PathVariable Activity.CallType callType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return getActivityUseCase.excuteGetByActivityCallTypeAndCallType(callType, page, size, currentUser.getId(), currentUser.getRoleId());
    }

    @GetMapping("/advanced-search")
    @PreAuthorize("hasAuthority('activities.advanced_search')")
    public PagedResult<ActivityDetailsResponseDTO> advancedSearch(
            @ModelAttribute ActivityAdvancedSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        return getActivityUseCase.executeAdvancedSearch(request, page, size, currentUser.getId(), currentUser.getRoleId());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('activities.create')")
    public ActivityResponseDTO createActivity(@RequestBody ActivityCreationRequest request) {
        Activity activityToCreate = mapper.toDomain(request);
        Activity createdActivity = createActivityUseCase.execute(activityToCreate);
        return mapper.toResponse(createdActivity);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('activities.update')")
    public ActivityResponseDTO updateActivity(@PathVariable Integer id, @RequestBody ActivityUpdateRequest request) {
        Activity activityToUpdate = mapper.toDomain(request);
        Activity updatedActivity = updateActivityUseCase.execute(id, activityToUpdate);
        return mapper.toResponse(updatedActivity);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('activities.delete')")
    public String deleteActivity(@PathVariable Integer id) {
        deleteActivityUseCase.excute(id);
        return "Delete completed";
    }
}