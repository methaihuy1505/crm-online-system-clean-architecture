package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task;
import com.vti.crm.interfaces.dto.request.task.TaskCreationRequest;
import com.vti.crm.interfaces.dto.request.task.TaskUpdateRequest;
import com.vti.crm.interfaces.dto.response.task.TaskDetailsResponseDTO;
import com.vti.crm.interfaces.dto.response.task.TaskResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskWebMapper {
    Task toDomainCreate(TaskCreationRequest request);
    Task toDomainUpdate(TaskUpdateRequest request);

    // Map từ Domain Entity sang Response DTO trả về cho Client (Dùng cho POST/PUT nếu cần)
    TaskResponseDTO toResponse(Task task);

    TaskDetailsResponseDTO toDetailsResponse(Task task);

    PagedResult<TaskResponseDTO> toResponseList(PagedResult<Task> tasks);

    PagedResult<TaskDetailsResponseDTO> toDetailsResponseList(PagedResult<Task> tasks);
}
