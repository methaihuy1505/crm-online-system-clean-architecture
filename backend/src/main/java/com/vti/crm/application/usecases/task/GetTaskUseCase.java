package com.vti.crm.application.usecases.task;

import com.vti.crm.application.usecases.customer.GetCustomerByIdUseCase;
import com.vti.crm.application.usecases.lead.GetLeadByIdUseCase;
import com.vti.crm.application.usecases.opportunity.GetOpportunityByIdUseCase;
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

    // Luồng Lead chạy dữ liệu thật
    private final GetLeadByIdUseCase getIdLeadUseCase;
    private final GetCustomerByIdUseCase getIdCustomerUseCase;
    private final GetOpportunityByIdUseCase getOpportunityByIdUseCase;

    /**
     * 1. Luồng lấy toàn bộ danh sách Task (Đã được đồng bộ sang DTO chi tiết và vá dữ liệu)
     */
    public PagedResult<TaskDetailsResponseDTO> excuteGetAll(int page, int size) {
        PagedResult<Task> tasksDomain = iTaskRepository.findAll(page, size);
        PagedResult<TaskDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(tasksDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }
        return responsePage;
    }

    /**
     * 2. Luồng xem chi tiết 1 công việc lẻ
     */
    public TaskDetailsResponseDTO excuteGetById(Integer id) {
        Task task = iTaskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Task với ID: " + id));

        TaskDetailsResponseDTO responseDto = mapper.toDetailsResponse(task);

        // Đắp dữ liệu chữ (User giả lập, Lead thật)
        enrichResponseData(responseDto);

        return responseDto;
    }

    /**
     * 3. Luồng tìm kiếm phân trang nâng cao
     */
    public PagedResult<TaskDetailsResponseDTO> executeAdvancedSearch(TaskAdvancedSearchRequest request, int page, int size) {
        PagedResult<Task> tasksDomain = iTaskRepository.advancedSearch(
                request.getRelateType(),
                request.getPriority(),
                request.getStatus(),
                request.getIsOverdue(),
                page,
                size
        );

        PagedResult<TaskDetailsResponseDTO> responsePage = mapper.toDetailsResponseList(tasksDomain);

        if (responsePage.getData() != null) {
            responsePage.getData().forEach(this::enrichResponseData);
        }

        return responsePage;
    }

    private void enrichResponseData(TaskDetailsResponseDTO response) {

        // 1. Vá tạm tên người giao việc (createdBy)
        if (response.getCreatedBy() != null) {
            response.setCreatedByName("Người quản trị (Admin)");
        } else {
            response.setCreatedByName("Hệ thống tự động");
        }

        // 2. Vá tạm tên người phụ trách (assignedTo)
        if (response.getAssignedTo() != null) {
            response.setAssignedToName("Võ Thanh Huy");
        } else {
            response.setAssignedToName("Chưa phân phối");
        }

        // 3. LUỒNG THẬT 100%: Xử lý đa hình đối tượng liên kết (relateType & relateId) từ các module đối tác
        if (response.getRelateId() != null && response.getRelateType() != null) {
            switch (response.getRelateType()) {

                case LEAD:
                    try {
                        String leadName = getIdLeadUseCase.execute(response.getRelateId()).getFullName();
                        response.setRelateName(leadName);
                    } catch (Exception e) {
                        response.setRelateName("Khách hàng tiềm năng #" + response.getRelateId() + " (Lỗi tải tên)");
                    }
                    break;

                case CUSTOMER:
                    try {
                        // Gọi sang UseCase của Customer để bốc dữ liệu thật từ DB của bạn
                        String customerName = getIdCustomerUseCase.execute(response.getRelateId()).getName();
                        response.setRelateName(customerName);
                    } catch (Exception e) {
                        response.setRelateName("Khách hàng #" + response.getRelateId() + " (Lỗi tải tên)");
                    }
                    break;

                case OPPORTUNITY:
                    try {
                        // Gọi sang UseCase của Opportunity để bốc dữ liệu thật từ DB của bạn
                        // Huy lưu ý: Hãy kiểm tra lại hàm lấy tên của Opportunity là .getFullName() hay .getOpportunityName() hoặc .getName() để chỉnh lại cho khít nhé!
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