package com.vti.crm.infrastructure.persistence.mapper.task;

import com.vti.crm.domain.model.Task.Task;
import com.vti.crm.infrastructure.persistence.entity.task.TaskEntity;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-18T16:43:49+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Microsoft)"
)
@Component
public class TaskInfraMapperImpl implements TaskInfraMapper {

    @Override
    public Task toDomain(TaskEntity entity) {
        if ( entity == null ) {
            return null;
        }

        Integer id = null;
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
        LocalDateTime deletedAt = null;
        Integer createdBy = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;
        Integer updatedBy = null;

        id = entity.getId();
        title = entity.getTitle();
        description = entity.getDescription();
        priority = priorityToPriority( entity.getPriority() );
        startDate = entity.getStartDate();
        endDate = entity.getEndDate();
        status = statusToStatus( entity.getStatus() );
        extensionCount = entity.getExtensionCount();
        isOverdue = entity.getIsOverdue();
        assignedTo = entity.getAssignedTo();
        relateType = relateTypeToRelateType( entity.getRelateType() );
        relateId = entity.getRelateId();
        deletedAt = entity.getDeletedAt();
        createdBy = entity.getCreatedBy();
        createdAt = entity.getCreatedAt();
        updatedAt = entity.getUpdatedAt();
        updatedBy = entity.getUpdatedBy();

        Task task = new Task( id, title, description, priority, startDate, endDate, status, extensionCount, isOverdue, assignedTo, relateType, relateId, deletedAt, createdBy, createdAt, updatedAt, updatedBy );

        return task;
    }

    @Override
    public TaskEntity toEntity(Task domain) {
        if ( domain == null ) {
            return null;
        }

        TaskEntity.TaskEntityBuilder taskEntity = TaskEntity.builder();

        taskEntity.id( domain.getId() );
        taskEntity.title( domain.getTitle() );
        taskEntity.description( domain.getDescription() );
        taskEntity.priority( priorityToPriority1( domain.getPriority() ) );
        taskEntity.startDate( domain.getStartDate() );
        taskEntity.endDate( domain.getEndDate() );
        taskEntity.status( statusToStatus1( domain.getStatus() ) );
        taskEntity.extensionCount( domain.getExtensionCount() );
        taskEntity.isOverdue( domain.getIsOverdue() );
        taskEntity.assignedTo( domain.getAssignedTo() );
        taskEntity.relateType( relateTypeToRelateType1( domain.getRelateType() ) );
        taskEntity.relateId( domain.getRelateId() );
        taskEntity.deletedAt( domain.getDeletedAt() );
        taskEntity.createdBy( domain.getCreatedBy() );
        taskEntity.createdAt( domain.getCreatedAt() );
        taskEntity.updatedAt( domain.getUpdatedAt() );
        taskEntity.updatedBy( domain.getUpdatedBy() );

        return taskEntity.build();
    }

    protected Task.Priority priorityToPriority(TaskEntity.Priority priority) {
        if ( priority == null ) {
            return null;
        }

        Task.Priority priority1;

        switch ( priority ) {
            case LOW: priority1 = Task.Priority.LOW;
            break;
            case MEDIUM: priority1 = Task.Priority.MEDIUM;
            break;
            case HIGH: priority1 = Task.Priority.HIGH;
            break;
            case URGENT: priority1 = Task.Priority.URGENT;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + priority );
        }

        return priority1;
    }

    protected Task.Status statusToStatus(TaskEntity.Status status) {
        if ( status == null ) {
            return null;
        }

        Task.Status status1;

        switch ( status ) {
            case NOT_STARTED: status1 = Task.Status.NOT_STARTED;
            break;
            case IN_PROGRESS: status1 = Task.Status.IN_PROGRESS;
            break;
            case PENDING: status1 = Task.Status.PENDING;
            break;
            case COMPLETED: status1 = Task.Status.COMPLETED;
            break;
            case CANCELED: status1 = Task.Status.CANCELED;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + status );
        }

        return status1;
    }

    protected Task.RelateType relateTypeToRelateType(TaskEntity.RelateType relateType) {
        if ( relateType == null ) {
            return null;
        }

        Task.RelateType relateType1;

        switch ( relateType ) {
            case LEAD: relateType1 = Task.RelateType.LEAD;
            break;
            case CUSTOMER: relateType1 = Task.RelateType.CUSTOMER;
            break;
            case OPPORTUNITY: relateType1 = Task.RelateType.OPPORTUNITY;
            break;
            case FEEDBACK: relateType1 = Task.RelateType.FEEDBACK;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + relateType );
        }

        return relateType1;
    }

    protected TaskEntity.Priority priorityToPriority1(Task.Priority priority) {
        if ( priority == null ) {
            return null;
        }

        TaskEntity.Priority priority1;

        switch ( priority ) {
            case LOW: priority1 = TaskEntity.Priority.LOW;
            break;
            case MEDIUM: priority1 = TaskEntity.Priority.MEDIUM;
            break;
            case HIGH: priority1 = TaskEntity.Priority.HIGH;
            break;
            case URGENT: priority1 = TaskEntity.Priority.URGENT;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + priority );
        }

        return priority1;
    }

    protected TaskEntity.Status statusToStatus1(Task.Status status) {
        if ( status == null ) {
            return null;
        }

        TaskEntity.Status status1;

        switch ( status ) {
            case NOT_STARTED: status1 = TaskEntity.Status.NOT_STARTED;
            break;
            case IN_PROGRESS: status1 = TaskEntity.Status.IN_PROGRESS;
            break;
            case PENDING: status1 = TaskEntity.Status.PENDING;
            break;
            case COMPLETED: status1 = TaskEntity.Status.COMPLETED;
            break;
            case CANCELED: status1 = TaskEntity.Status.CANCELED;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + status );
        }

        return status1;
    }

    protected TaskEntity.RelateType relateTypeToRelateType1(Task.RelateType relateType) {
        if ( relateType == null ) {
            return null;
        }

        TaskEntity.RelateType relateType1;

        switch ( relateType ) {
            case LEAD: relateType1 = TaskEntity.RelateType.LEAD;
            break;
            case CUSTOMER: relateType1 = TaskEntity.RelateType.CUSTOMER;
            break;
            case OPPORTUNITY: relateType1 = TaskEntity.RelateType.OPPORTUNITY;
            break;
            case FEEDBACK: relateType1 = TaskEntity.RelateType.FEEDBACK;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + relateType );
        }

        return relateType1;
    }
}
