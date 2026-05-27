package com.vti.crm.application.usecases.activity;

import com.vti.crm.application.usecases.contact.GetContactByIdUseCase;
import com.vti.crm.application.usecases.customer.GetCustomerByIdUseCase;
import com.vti.crm.application.usecases.lead.GetLeadByIdUseCase;
import com.vti.crm.application.usecases.opportunity.GetOpportunityByIdUseCase;
import com.vti.crm.application.usecases.task.GetTaskUseCase;
import com.vti.crm.domain.model.Activity;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.repository.IActivityRepository;
import com.vti.crm.interfaces.dto.request.activity.ActivityAdvancedSearchRequest;
import com.vti.crm.interfaces.dto.response.activity.ActivityDetailsResponseDTO;
import com.vti.crm.interfaces.mapper.ActivityWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetActivityUseCase {
    private final IActivityRepository activityRepository;
    private final ActivityWebMapper mapper;

    // Tiêm các dịch vụ liên module dữ liệu thật
    private final GetLeadByIdUseCase getIdLeadUseCase;
    private final GetCustomerByIdUseCase getIdCustomerUseCase;
    private final GetOpportunityByIdUseCase getOpportunityByIdUseCase;
    private final GetTaskUseCase getTaskUseCase; // Module Task
    private final GetContactByIdUseCase getContactByIdUseCase; // Module Contact

    public PagedResult<ActivityDetailsResponseDTO> excuteGetAll(int page, int size) {
        PagedResult<Activity> activitiesDomain = activityRepository.findAll(page, size);
        PagedResult<ActivityDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(activitiesDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    public ActivityDetailsResponseDTO excuteGetById(Integer id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Hoạt động với ID: " + id));

        ActivityDetailsResponseDTO responseDto = mapper.toDetailsResponse(activity);
        enrichResponseData(responseDto);
        return responseDto;
    }

    public PagedResult<ActivityDetailsResponseDTO> excuteGetByActivityType(Activity.ActivityType activityType, int page, int size) {
        PagedResult<Activity> activitiesDomain = activityRepository.findByActivityType(activityType, page, size);
        PagedResult<ActivityDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(activitiesDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    public PagedResult<ActivityDetailsResponseDTO> excuteGetByActivityTypeAndParentType(Activity.ActivityType activityType, Activity.ParentType parentType, int page, int size) {
        PagedResult<Activity> activitiesDomain = activityRepository.findByActivityTypeAndParentType(activityType, parentType, page, size);
        PagedResult<ActivityDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(activitiesDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    public PagedResult<ActivityDetailsResponseDTO> excuteGetByActivityCallTypeAndCallType(Activity.CallType callType, int page, int size) {
        PagedResult<Activity> activitiesDomain = activityRepository.findByActivityCallTypeAndCallType(callType, page, size);
        PagedResult<ActivityDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(activitiesDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    public PagedResult<ActivityDetailsResponseDTO> executeAdvancedSearch(ActivityAdvancedSearchRequest request, int page, int size) {
        PagedResult<Activity> activitiesDomain = activityRepository.advancedSearch(
                request.getActivityType(),
                request.getParentTypes(),
                request.getIsPriority(),
                request.getIsCompleted(),
                request.getCallType(),
                page, size);
        PagedResult<ActivityDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(activitiesDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    // --- HÀM ĐẮP CHỮ LIÊN MODULE TOÀN DIỆN ---
    private void enrichResponseData(ActivityDetailsResponseDTO response) {
        // 1. Vá tạm User tạo
        if (response.getCreatedBy() != null) {
            response.setCreatedByName("Người quản trị (Admin)");
        } else {
            response.setCreatedByName("Hệ thống");
        }

        // 2. Lấy dữ liệu thật tiêu đề Task liên kết (Nếu có)
        if (response.getTaskId() != null) {
            try {
                String title = getTaskUseCase.excuteGetById(response.getTaskId()).getTitle();
                response.setTaskTitle(title);
            } catch (Exception e) {
                response.setTaskTitle("Công việc #" + response.getTaskId() + " (Lỗi tải)");
            }
        }

        // 3. Lấy dữ liệu thật tên Người liên hệ Contact (Nếu có)
        if (response.getContactId() != null) {
            try {

                String contactName = getContactByIdUseCase.execute(response.getContactId()).getLastName();
                response.setContactName(contactName);
            } catch (Exception e) {
                response.setContactName("Người liên hệ #" + response.getContactId() + " (Lỗi tải)");
            }
        }

        // 4. LUỒNG DATA THẬT: Đối tượng đa hình sở hữu (LEAD, CUSTOMER, OPPORTUNITY)
        if (response.getParentId() != null && response.getParentType() != null) {
            switch (response.getParentType()) {
                case LEAD:
                    try {
                        String leadName = getIdLeadUseCase.execute(response.getParentId()).getFullName();
                        response.setParentName(leadName);
                    } catch (Exception e) {
                        response.setParentName("Khách hàng tiềm năng #" + response.getParentId() + " (Lỗi tải)");
                    }
                    break;

                case CUSTOMER:
                    try {
                        String customerName = getIdCustomerUseCase.execute(response.getParentId()).getName();
                        response.setParentName(customerName);
                    } catch (Exception e) {
                        response.setParentName("Khách hàng #" + response.getParentId() + " (Lỗi tải)");
                    }
                    break;

                case OPPORTUNITY:
                    try {
                        String oppName = getOpportunityByIdUseCase.execute(response.getParentId()).getName();
                        response.setParentName(oppName);
                    } catch (Exception e) {
                        response.setParentName("Cơ hội #" + response.getParentId() + " (Lỗi tải)");
                    }
                    break;

                default:
                    response.setParentName("Đối tượng #" + response.getParentId());
                    break;
            }
        } else {
            response.setParentName("Không có liên kết");
        }
    }
}
