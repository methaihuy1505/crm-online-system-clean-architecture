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
import com.vti.crm.interfaces.dto.response.activity.ActivityDetailsResponseDTO;
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

    // Inject MapStruct Mapper (Dùng cho luồng POST/PUT)
    private final ActivityWebMapper mapper;

    /**
     * 1. Lấy toàn bộ danh sách Activity (Đã đắp đầy đủ chữ thật liên module)
     */
    @GetMapping
    public PagedResult<ActivityDetailsResponseDTO> getAllActivities(@RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "10") int size) {
        // Gọi thẳng UseCase gánh gọn danh sách đã enrich dữ liệu chữ thật
        return getActivityUseCase.excuteGetAll(page, size);
    }

    /**
     * 2. Lấy chi tiết 1 Activity theo ID
     */
    @GetMapping("/{id}")
    public ActivityDetailsResponseDTO getActivityById(@PathVariable Integer id) {
        return getActivityUseCase.excuteGetById(id);
    }

    /**
     * 3. Lấy danh sách Activity lọc theo loại Hoạt động
     */
    @GetMapping("/activity-type/{activityType}")
    public PagedResult<ActivityDetailsResponseDTO> getActivitiesByActivityType(
            @PathVariable Activity.ActivityType activityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return getActivityUseCase.excuteGetByActivityType(activityType, page, size);
    }

    /**
     * 4. Lấy danh sách Activity lọc phối hợp loại Hoạt động và Loại đối tượng liên kết
     */
    @GetMapping("/activity-type/{activityType}/parent-type/{parentType}")
    public PagedResult<ActivityDetailsResponseDTO> getActivitiesByActivityTypeAndParentType(
            @PathVariable Activity.ActivityType activityType,
            @PathVariable Activity.ParentType parentType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return getActivityUseCase.excuteGetByActivityTypeAndParentType(activityType, parentType, page, size);
    }

    /**
     * 5. Lấy danh sách cuộc gọi theo loại cuộc gọi (Inbound/Outbound)
     */
    @GetMapping("/activity-type/callType/{callType}")
    public PagedResult<ActivityDetailsResponseDTO> getByActivityCallTypeAndCallType(
            @PathVariable Activity.CallType callType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return getActivityUseCase.excuteGetByActivityCallTypeAndCallType(callType, page, size);
    }

    /**
     * 6. Tìm kiếm bộ lọc nâng cao nâng cấp chữ thật cho Activity
     */
    @GetMapping("/advanced-search")
    public PagedResult<ActivityDetailsResponseDTO> advancedSearch(
            @ModelAttribute ActivityAdvancedSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return getActivityUseCase.executeAdvancedSearch(request, page, size);
    }

    /**
     * 7. Tạo mới Activity
     */
    @PostMapping
    public ActivityResponseDTO createActivity(@RequestBody ActivityCreationRequest request) {
        // 1. Map Request -> Domain
        Activity activityToCreate = mapper.toDomain(request);

        // 2. Chuyền cục Domain vào UseCase xử lý nghiệp vụ validation
        Activity createdActivity = createActivityUseCase.execute(activityToCreate);

        // 3. Map Domain -> Response cơ bản (Dành cho tạo mới thành công)
        return mapper.toResponse(createdActivity);
    }

    /**
     * 8. Cập nhật Activity
     */
    @PutMapping("/{id}")
    public ActivityResponseDTO updateActivity(@PathVariable Integer id, @RequestBody ActivityUpdateRequest request) {
        // 1. Map Request -> Domain
        Activity activityToUpdate = mapper.toDomain(request);

        // 2. UseCase xử lý cập nhật trạng thái biến đổi (State Mutation)
        Activity updatedActivity = updateActivityUseCase.execute(id, activityToUpdate);

        // 3. Map Domain -> Response cơ bản
        return mapper.toResponse(updatedActivity);
    }

    /**
     * 9. Xóa mềm Activity
     */
    @DeleteMapping("/{id}")
    public String deleteActivity(@PathVariable Integer id) {
        deleteActivityUseCase.excute(id);
        return "Delete completed";
    }
}