package com.vti.crm.infrastructure.persistence.mapper.task;

import com.vti.crm.domain.model.Task.TaskNote;
import com.vti.crm.infrastructure.persistence.entity.task.TaskNoteEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-06T01:09:49+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Microsoft)"
)
@Component
public class TaskNoteInfraMapperImpl implements TaskNoteInfraMapper {

    @Override
    public TaskNote toDomain(TaskNoteEntity entity) {
        if ( entity == null ) {
            return null;
        }

        TaskNote taskNote = new TaskNote();

        taskNote.setId( entity.getId() );
        taskNote.setTaskId( entity.getTaskId() );
        taskNote.setUserId( entity.getUserId() );
        taskNote.setContent( entity.getContent() );
        taskNote.setCreatedAt( entity.getCreatedAt() );
        taskNote.setDeletedAt( entity.getDeletedAt() );
        taskNote.setUpdateAt( entity.getUpdateAt() );

        return taskNote;
    }

    @Override
    public TaskNoteEntity toEntity(TaskNote domain) {
        if ( domain == null ) {
            return null;
        }

        TaskNoteEntity.TaskNoteEntityBuilder taskNoteEntity = TaskNoteEntity.builder();

        taskNoteEntity.id( domain.getId() );
        taskNoteEntity.taskId( domain.getTaskId() );
        taskNoteEntity.userId( domain.getUserId() );
        taskNoteEntity.content( domain.getContent() );
        taskNoteEntity.createdAt( domain.getCreatedAt() );
        taskNoteEntity.deletedAt( domain.getDeletedAt() );
        taskNoteEntity.updateAt( domain.getUpdateAt() );

        return taskNoteEntity.build();
    }
}
