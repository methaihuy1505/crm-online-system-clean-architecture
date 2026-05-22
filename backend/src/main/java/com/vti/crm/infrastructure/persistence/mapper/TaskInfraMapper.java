package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Task;
import com.vti.crm.infrastructure.persistence.entity.TaskEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskInfraMapper {
    Task toDomain(TaskEntity entity);

    TaskEntity toEntity(Task domain);
}
