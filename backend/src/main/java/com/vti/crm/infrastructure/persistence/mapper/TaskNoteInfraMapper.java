package com.vti.crm.infrastructure.persistence.mapper;


import com.vti.crm.domain.model.TaskNote;
import com.vti.crm.infrastructure.persistence.entity.TaskNoteEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskNoteInfraMapper {
    TaskNote toDomain(TaskNoteEntity entity);

    TaskNoteEntity toEntity(TaskNote domain);
}
