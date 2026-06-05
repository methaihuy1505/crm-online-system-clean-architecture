package com.vti.crm.application.usecases.activity;

import com.vti.crm.application.usecases.contact.GetContactByIdUseCase;
import com.vti.crm.application.usecases.customer.GetCustomerByIdUseCase;
import com.vti.crm.application.usecases.lead.GetLeadByIdUseCase;
import com.vti.crm.application.usecases.opportunity.GetOpportunityByIdUseCase;
import com.vti.crm.application.usecases.task.GetTaskUseCase;
import com.vti.crm.application.usecases.user.GetUserByIdUseCase;
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

    private final GetLeadByIdUseCase getIdLeadUseCase;
    private final GetCustomerByIdUseCase getIdCustomerUseCase;
    private final GetOpportunityByIdUseCase getOpportunityByIdUseCase;
    private final GetTaskUseCase getTaskUseCase;
    private final GetContactByIdUseCase getContactByIdUseCase;
    private final GetUserByIdUseCase getUserByIdUseCase;

    // HÀM XÁC ĐỊNH QUYỀN LỌC DỮ LIỆU
    private Integer determineFilterUserId(Integer currentUserId, Integer roleId) {
        // Giả định Role Admin = 1, Manager = 4
        // Nếu là Quản lý/Admin thì trả về null (Để Repository lấy tất cả)
        if (roleId != null && (roleId == 1 || roleId == 4)) {
            return null;
        }
        // Nếu là nhân viên thường, trả về ID của họ để lọc
        return currentUserId;
    }

    public PagedResult<ActivityDetailsResponseDTO> excuteGetAll(int page, int size, Integer currentUserId, Integer roleId) {
        Integer filterUserId = determineFilterUserId(currentUserId, roleId);
        // Truyền thêm filterUserId vào hàm cũ của Repository
        PagedResult<Activity> activitiesDomain = activityRepository.findAll(page, size, filterUserId);
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

    public PagedResult<ActivityDetailsResponseDTO> excuteGetByActivityType(Activity.ActivityType activityType, int page, int size, Integer currentUserId, Integer roleId) {
        Integer filterUserId = determineFilterUserId(currentUserId, roleId);
        PagedResult<Activity> activitiesDomain = activityRepository.findByActivityType(activityType, page, size, filterUserId);
        PagedResult<ActivityDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(activitiesDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    public PagedResult<ActivityDetailsResponseDTO> excuteGetByActivityTypeAndParentType(Activity.ActivityType activityType, Activity.ParentType parentType, int page, int size, Integer currentUserId, Integer roleId) {
        Integer filterUserId = determineFilterUserId(currentUserId, roleId);
        PagedResult<Activity> activitiesDomain = activityRepository.findByActivityTypeAndParentType(activityType, parentType, page, size, filterUserId);
        PagedResult<ActivityDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(activitiesDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    public PagedResult<ActivityDetailsResponseDTO> excuteGetByActivityCallTypeAndCallType(Activity.CallType callType, int page, int size, Integer currentUserId, Integer roleId) {
        Integer filterUserId = determineFilterUserId(currentUserId, roleId);
        PagedResult<Activity> activitiesDomain = activityRepository.findByActivityCallTypeAndCallType(callType, page, size, filterUserId);
        PagedResult<ActivityDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(activitiesDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    public PagedResult<ActivityDetailsResponseDTO> executeAdvancedSearch(ActivityAdvancedSearchRequest request, int page, int size, Integer currentUserId, Integer roleId) {
        Integer filterUserId = determineFilterUserId(currentUserId, roleId);

        // Truyền thêm filterUserId vào hàm advancedSearch
        PagedResult<Activity> activitiesDomain = activityRepository.advancedSearch(
                request.getKeyword(),
                request.getActivityType(),
                request.getParentTypes(),
                request.getParentId(),
                request.getIsPriority(),
                request.getIsCompleted(),
                request.getCallType(),
                page, size, filterUserId);

        PagedResult<ActivityDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(activitiesDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    private void enrichResponseData(ActivityDetailsResponseDTO response) {
        if (response.getCreatedBy() != null) {
            try {
                String userName = getUserByIdUseCase.execute(response.getCreatedBy())
                        .getFullName();
                response.setCreatedByName(userName);
            } catch (Exception e) {
                response.setCreatedByName("Nhân sự #" + response.getCreatedBy());
            }
        } else {
            response.setCreatedByName("Hệ thống");
        }

        // 2. Lấy dữ liệu thật tiêu đề Task liên kết (Nếu có)
        if (response.getTaskId() != null) {
            try {
                String title = getTaskUseCase.excuteGetById(response.getTaskId()).getTitle();
                response.setTaskTitle(title);
            } catch (Exception e) {
                response.setTaskTitle("Công việc #" + response.getTaskId());
            }
        }

        // 3. Lấy dữ liệu thật tên Người liên hệ Contact (Nếu có)
        if (response.getContactId() != null) {
            try {
                String contactName = getContactByIdUseCase.execute(response.getContactId()).getLastName();
                response.setContactName(contactName);
            } catch (Exception e) {
                response.setContactName("Người liên hệ #" + response.getContactId());
            }
        }

        // 4. LUỒNG DATA THẬT: Đối tượng đa hình sở hữu (LEAD, CUSTOMER, OPPORTUNITY)
        if (response.getParentId() != null && response.getParentType() != null) {
            switch (response.getParentType()) {
                case LEAD:
                    try {
                        String leadName = getIdLeadUseCase.execute(response.getParentId(),null,null).getFullName();
                        response.setParentName(leadName);
                    } catch (Exception e) {
                        response.setParentName("Khách hàng tiềm năng #" + response.getParentId());
                    }
                    break;

                case CUSTOMER:
                    try {
                        String customerName = getIdCustomerUseCase.execute(response.getParentId(),null,null).getName();
                        response.setParentName(customerName);
                    } catch (Exception e) {
                        response.setParentName("Khách hàng #" + response.getParentId());
                    }
                    break;

                case OPPORTUNITY:
                    try {
                        String oppName = getOpportunityByIdUseCase.execute(response.getParentId()).getName();
                        response.setParentName(oppName);
                    } catch (Exception e) {
                        response.setParentName("Cơ hội #" + response.getParentId());
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