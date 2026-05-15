package com.vti.crm.interfaces.mapper.Task;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task.Task;
import com.vti.crm.interfaces.dto.request.task.TaskCreationRequest;
import com.vti.crm.interfaces.dto.request.task.TaskUpdateRequest;
import com.vti.crm.interfaces.dto.response.task.TaskResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskWebMapper {
    // Map từ Request DTO của Client sang Domain Entity
    Task toDomainCreate(TaskCreationRequest request);
    Task toDomainUpdate(TaskUpdateRequest request);
    // Map từ Domain Entity sang Response DTO trả về cho Client
    TaskResponseDTO toResponse(Task task);
    // Tự động map cho cả 1 List
    PagedResult<TaskResponseDTO> toResponseList(PagedResult<Task> tasks);
}
