package com.vti.crm.interfaces.mapper.Task;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task.Task;
import com.vti.crm.interfaces.dto.request.task.TaskCreationRequest;
import com.vti.crm.interfaces.dto.request.task.TaskUpdateRequest;
import com.vti.crm.interfaces.dto.response.task.TaskResponseDTO;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-18T16:43:49+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Microsoft)"
)
@Component
public class TaskWebMapperImpl implements TaskWebMapper {

    @Override
    public Task toDomainCreate(TaskCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        String title = null;
        String description = null;
        Task.Priority priority = null;
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;
        Task.Status status = null;
        Integer extensionCount = null;
        Boolean isOverdue = null;
        Integer assignedTo = null;
        Task.RelateType relateType = null;
        Integer relateId = null;
        Integer createdBy = null;

        title = request.getTitle();
        description = request.getDescription();
        priority = request.getPriority();
        startDate = request.getStartDate();
        endDate = request.getEndDate();
        status = request.getStatus();
        extensionCount = request.getExtensionCount();
        isOverdue = request.getIsOverdue();
        assignedTo = request.getAssignedTo();
        relateType = request.getRelateType();
        relateId = request.getRelateId();
        createdBy = request.getCreatedBy();

        Integer id = null;
        LocalDateTime deletedAt = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;
        Integer updatedBy = null;

        Task task = new Task( id, title, description, priority, startDate, endDate, status, extensionCount, isOverdue, assignedTo, relateType, relateId, deletedAt, createdBy, createdAt, updatedAt, updatedBy );

        return task;
    }

    @Override
    public Task toDomainUpdate(TaskUpdateRequest request) {
        if ( request == null ) {
            return null;
        }

        String title = null;
        String description = null;
        Task.Priority priority = null;
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;
        Task.Status status = null;
        Integer extensionCount = null;
        Boolean isOverdue = null;
        Integer assignedTo = null;
        Task.RelateType relateType = null;
        Integer relateId = null;
        Integer updatedBy = null;

        title = request.getTitle();
        description = request.getDescription();
        priority = request.getPriority();
        startDate = request.getStartDate();
        endDate = request.getEndDate();
        status = request.getStatus();
        extensionCount = request.getExtensionCount();
        isOverdue = request.getIsOverdue();
        assignedTo = request.getAssignedTo();
        relateType = request.getRelateType();
        relateId = request.getRelateId();
        updatedBy = request.getUpdatedBy();

        Integer id = null;
        LocalDateTime deletedAt = null;
        Integer createdBy = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;

        Task task = new Task( id, title, description, priority, startDate, endDate, status, extensionCount, isOverdue, assignedTo, relateType, relateId, deletedAt, createdBy, createdAt, updatedAt, updatedBy );

        return task;
    }

    @Override
    public TaskResponseDTO toResponse(Task task) {
        if ( task == null ) {
            return null;
        }

        TaskResponseDTO.TaskResponseDTOBuilder taskResponseDTO = TaskResponseDTO.builder();

        taskResponseDTO.id( task.getId() );
        taskResponseDTO.title( task.getTitle() );
        taskResponseDTO.description( task.getDescription() );
        taskResponseDTO.priority( task.getPriority() );
        taskResponseDTO.startDate( task.getStartDate() );
        taskResponseDTO.endDate( task.getEndDate() );
        taskResponseDTO.status( task.getStatus() );
        taskResponseDTO.extensionCount( task.getExtensionCount() );
        taskResponseDTO.isOverdue( task.getIsOverdue() );
        taskResponseDTO.assignedTo( task.getAssignedTo() );
        taskResponseDTO.relateType( task.getRelateType() );
        taskResponseDTO.relateId( task.getRelateId() );
        taskResponseDTO.deletedAt( task.getDeletedAt() );
        taskResponseDTO.createdBy( task.getCreatedBy() );
        taskResponseDTO.createdAt( task.getCreatedAt() );
        taskResponseDTO.updatedAt( task.getUpdatedAt() );
        taskResponseDTO.updatedBy( task.getUpdatedBy() );

        return taskResponseDTO.build();
    }

    @Override
    public PagedResult<TaskResponseDTO> toResponseList(PagedResult<Task> tasks) {
        if ( tasks == null ) {
            return null;
        }

        PagedResult<TaskResponseDTO> pagedResult = new PagedResult<TaskResponseDTO>();

        pagedResult.setData( taskListToTaskResponseDTOList( tasks.getData() ) );
        pagedResult.setCurrentPage( tasks.getCurrentPage() );
        pagedResult.setPageSize( tasks.getPageSize() );
        pagedResult.setTotalElements( tasks.getTotalElements() );
        pagedResult.setTotalPages( tasks.getTotalPages() );

        return pagedResult;
    }

    protected List<TaskResponseDTO> taskListToTaskResponseDTOList(List<Task> list) {
        if ( list == null ) {
            return null;
        }

        List<TaskResponseDTO> list1 = new ArrayList<TaskResponseDTO>( list.size() );
        for ( Task task : list ) {
            list1.add( toResponse( task ) );
        }

        return list1;
    }
}
