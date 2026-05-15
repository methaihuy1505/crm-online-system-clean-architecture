package com.vti.crm.infrastructure.persistence.mapper.task;

import com.vti.crm.domain.model.Task.Task;
import com.vti.crm.infrastructure.persistence.entity.task.TaskEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskInfraMapper {
    Task toDomain(TaskEntity entity);

    TaskEntity toEntity(Task domain);
}
