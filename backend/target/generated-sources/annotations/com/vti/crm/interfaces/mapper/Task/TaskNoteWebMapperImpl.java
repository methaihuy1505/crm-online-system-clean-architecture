package com.vti.crm.interfaces.mapper.Task;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task.TaskNote;
import com.vti.crm.interfaces.dto.request.task.TaskNoteCreationRequest;
import com.vti.crm.interfaces.dto.request.task.TaskNoteUpdateRequest;
import com.vti.crm.interfaces.dto.response.task.TaskNoteReponseDTO;
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
public class TaskNoteWebMapperImpl implements TaskNoteWebMapper {

    @Override
    public TaskNote toDomainCreate(TaskNoteCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        TaskNote taskNote = new TaskNote();

        taskNote.setTaskId( request.getTaskId() );
        taskNote.setUserId( request.getUserId() );
        taskNote.setContent( request.getContent() );

        return taskNote;
    }

    @Override
    public TaskNote toDomainUpdate(TaskNoteUpdateRequest request) {
        if ( request == null ) {
            return null;
        }

        TaskNote taskNote = new TaskNote();

        taskNote.setTaskId( request.getTaskId() );
        taskNote.setUserId( request.getUserId() );
        taskNote.setContent( request.getContent() );

        return taskNote;
    }

    @Override
    public TaskNoteReponseDTO toResponse(TaskNote taskNote) {
        if ( taskNote == null ) {
            return null;
        }

        TaskNoteReponseDTO.TaskNoteReponseDTOBuilder taskNoteReponseDTO = TaskNoteReponseDTO.builder();

        taskNoteReponseDTO.id( taskNote.getId() );
        taskNoteReponseDTO.taskId( taskNote.getTaskId() );
        taskNoteReponseDTO.userId( taskNote.getUserId() );
        taskNoteReponseDTO.content( taskNote.getContent() );
        taskNoteReponseDTO.createdAt( taskNote.getCreatedAt() );
        taskNoteReponseDTO.deletedAt( taskNote.getDeletedAt() );
        taskNoteReponseDTO.updateAt( taskNote.getUpdateAt() );

        return taskNoteReponseDTO.build();
    }

    @Override
    public PagedResult<TaskNoteReponseDTO> toResponseList(PagedResult<TaskNote> taskNote) {
        if ( taskNote == null ) {
            return null;
        }

        PagedResult<TaskNoteReponseDTO> pagedResult = new PagedResult<TaskNoteReponseDTO>();

        pagedResult.setData( taskNoteListToTaskNoteReponseDTOList( taskNote.getData() ) );
        pagedResult.setCurrentPage( taskNote.getCurrentPage() );
        pagedResult.setPageSize( taskNote.getPageSize() );
        pagedResult.setTotalElements( taskNote.getTotalElements() );
        pagedResult.setTotalPages( taskNote.getTotalPages() );

        return pagedResult;
    }

    protected List<TaskNoteReponseDTO> taskNoteListToTaskNoteReponseDTOList(List<TaskNote> list) {
        if ( list == null ) {
            return null;
        }

        List<TaskNoteReponseDTO> list1 = new ArrayList<TaskNoteReponseDTO>( list.size() );
        for ( TaskNote taskNote : list ) {
            list1.add( toResponse( taskNote ) );
        }

        return list1;
    }
}
