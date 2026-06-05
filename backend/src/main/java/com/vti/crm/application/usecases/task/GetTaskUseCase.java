package com.vti.crm.application.usecases.task;

import com.vti.crm.application.usecases.customer.GetCustomerByIdUseCase;
import com.vti.crm.application.usecases.lead.GetLeadByIdUseCase;
import com.vti.crm.application.usecases.opportunity.GetOpportunityByIdUseCase;
import com.vti.crm.application.usecases.user.GetUserByIdUseCase;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task;
import com.vti.crm.domain.repository.ITaskRepository;
import com.vti.crm.interfaces.dto.request.task.TaskAdvancedSearchRequest;
import com.vti.crm.interfaces.dto.response.task.TaskDetailsResponseDTO;
import org.springframework.stereotype.Service;
import com.vti.crm.interfaces.mapper.TaskWebMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetTaskUseCase {
    private final ITaskRepository iTaskRepository;
    private final TaskWebMapper mapper;

    private final GetLeadByIdUseCase getIdLeadUseCase;
    private final GetCustomerByIdUseCase getIdCustomerUseCase;
    private final GetOpportunityByIdUseCase getOpportunityByIdUseCase;
    private final GetUserByIdUseCase getUserByIdUseCase;

    // THÊM: currentUserId và roleId vào tham số
    public PagedResult<TaskDetailsResponseDTO> executeGetAll(int page, int size,String keyword, Integer currentUserId, Integer roleId) {

        // LOGIC LỌC: Nếu không phải Admin (roleId != 1), chỉ lấy việc mình tạo hoặc mình được giao
        Integer filterUserId = (roleId != null && roleId == 1) ? null : currentUserId;

        // THAY ĐỔI: Gọi hàm có truyền filterUserId xuống Repository
        PagedResult<Task> tasksDomain = iTaskRepository.findAllTasksWithFilter(page, size, keyword, filterUserId);

        PagedResult<TaskDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(tasksDomain);

        // GIỮ NGUYÊN: Vẫn gọi hàm enrichResponseData của bạn
        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    public TaskDetailsResponseDTO excuteGetById(Integer id) {
        Task task = iTaskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Task với ID: " + id));

        TaskDetailsResponseDTO responseDto = mapper.toDetailsResponse(task);

        enrichResponseData(responseDto);

        return responseDto;
    }

    // THÊM: currentUserId và roleId vào tìm kiếm nâng cao
    public PagedResult<TaskDetailsResponseDTO> executeAdvancedSearch(TaskAdvancedSearchRequest request, int page, int size, Integer currentUserId, Integer roleId) {

        Integer filterUserId = (roleId != null && roleId == 1) ? null : currentUserId;

        PagedResult<Task> tasksDomain = iTaskRepository.advancedSearchWithFilter(
                request.getKeyword(),
                request.getRelateType(),
                request.getPriority(),
                request.getStatus(),
                request.getIsOverdue(),
                page,
                size,
                filterUserId // Truyền thêm biến này xuống repo
        );

        PagedResult<TaskDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(tasksDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }

        return responsePage;
    }

    private void enrichResponseData(TaskDetailsResponseDTO response) {
        if (response.getCreatedBy() != null) {
            try {
                String creatorName = getUserByIdUseCase.execute(response.getCreatedBy())
                        .getFullName();
                response.setCreatedByName(creatorName);
            } catch (Exception e) {
                response.setCreatedByName("Nhân sự #" + response.getCreatedBy() + " (Lỗi tải)");
            }
        } else {
            response.setCreatedByName("Hệ thống tự động");
        }

        if (response.getAssignedTo() != null) {
            try {
                String assigneeName = getUserByIdUseCase.execute(response.getAssignedTo())
                        .getFullName();
                response.setAssignedToName(assigneeName);
            } catch (Exception e) {
                response.setAssignedToName("Nhân sự #" + response.getAssignedTo() + " (Lỗi tải)");
            }
        } else {
            response.setAssignedToName("Chưa phân phối");
        }

        if (response.getRelateId() != null && response.getRelateType() != null) {
            switch (response.getRelateType()) {

                case LEAD:
                    try {
                        String leadName = getIdLeadUseCase.execute(response.getRelateId(),null,null).getFullName();
                        response.setRelateName(leadName);
                    } catch (Exception e) {
                        response.setRelateName("Khách hàng tiềm năng #" + response.getRelateId() + " (Lỗi tải tên)");
                    }
                    break;

                case CUSTOMER:
                    try {
                        String customerName = getIdCustomerUseCase.execute(response.getRelateId(),null,null).getName();
                        response.setRelateName(customerName);
                    } catch (Exception e) {
                        response.setRelateName("Khách hàng #" + response.getRelateId() + " (Lỗi tải tên)");
                    }
                    break;

                case OPPORTUNITY:
                    try {
                        String opportunityName = getOpportunityByIdUseCase.execute(response.getRelateId()).getName();
                        response.setRelateName(opportunityName);
                    } catch (Exception e) {
                        response.setRelateName("Cơ hội #" + response.getRelateId() + " (Lỗi tải tên)");
                    }
                    break;

                default:
                    response.setRelateName("Đối tượng khác #" + response.getRelateId());
                    break;
            }
        } else {
            response.setRelateName("Không có liên kết");
        }
    }
}