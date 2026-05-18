package com.vti.crm.infrastructure.persistence.mapper.task;


import com.vti.crm.domain.model.Task.TaskNote;
import com.vti.crm.infrastructure.persistence.entity.task.TaskNoteEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskNoteInfraMapper {
    TaskNote toDomain(TaskNoteEntity entity);

    TaskNoteEntity toEntity(TaskNote domain);
}
