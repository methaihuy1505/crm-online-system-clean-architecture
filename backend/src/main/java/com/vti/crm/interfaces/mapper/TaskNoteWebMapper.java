package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.TaskNote;
import com.vti.crm.interfaces.dto.request.task.TaskNoteCreationRequest;
import com.vti.crm.interfaces.dto.request.task.TaskNoteUpdateRequest;

import com.vti.crm.interfaces.dto.response.task.TaskNoteReponseDTO;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskNoteWebMapper {
    TaskNote toDomainCreate(TaskNoteCreationRequest request);
    TaskNote toDomainUpdate(TaskNoteUpdateRequest request);

    TaskNoteReponseDTO toResponse(TaskNote taskNote);

    PagedResult<TaskNoteReponseDTO> toResponseList(PagedResult<TaskNote> taskNote);
}
