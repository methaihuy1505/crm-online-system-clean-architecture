package com.vti.crm.interfaces.mapper.Activity;

import com.vti.crm.domain.model.Activity.Activity;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.interfaces.dto.request.activity.ActivityCreationRequest;
import com.vti.crm.interfaces.dto.request.activity.ActivityUpdateRequest;
import com.vti.crm.interfaces.dto.response.activity.ActivityResponseDTO;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-06T01:09:49+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Microsoft)"
)
@Component
public class ActivityWebMapperImpl implements ActivityWebMapper {

    @Override
    public Activity toDomain(ActivityCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Activity.ActivityBuilder activity = Activity.builder();

        activity.taskId( request.getTaskId() );
        activity.parentId( request.getParentId() );
        activity.parentType( request.getParentType() );
        activity.contactId( request.getContactId() );
        activity.activityType( request.getActivityType() );
        activity.subject( request.getSubject() );
        activity.description( request.getDescription() );
        activity.callType( request.getCallType() );
        activity.callResult( request.getCallResult() );
        activity.startDate( request.getStartDate() );
        activity.endDate( request.getEndDate() );
        activity.location( request.getLocation() );
        activity.duration( request.getDuration() );
        activity.activityDate( request.getActivityDate() );
        activity.isPriority( request.getIsPriority() );
        activity.nextFollowUpDate( request.getNextFollowUpDate() );
        activity.isCompleted( request.getIsCompleted() );
        activity.createdBy( request.getCreatedBy() );

        return activity.build();
    }

    @Override
    public Activity toDomain(ActivityUpdateRequest request) {
        if ( request == null ) {
            return null;
        }

        Activity.ActivityBuilder activity = Activity.builder();

        activity.taskId( request.getTaskId() );
        activity.parentId( request.getParentId() );
        activity.parentType( request.getParentType() );
        activity.contactId( request.getContactId() );
        activity.activityType( request.getActivityType() );
        activity.subject( request.getSubject() );
        activity.description( request.getDescription() );
        activity.callType( request.getCallType() );
        activity.callResult( request.getCallResult() );
        activity.startDate( request.getStartDate() );
        activity.endDate( request.getEndDate() );
        activity.location( request.getLocation() );
        activity.duration( request.getDuration() );
        activity.activityDate( request.getActivityDate() );
        activity.isPriority( request.getIsPriority() );
        activity.nextFollowUpDate( request.getNextFollowUpDate() );
        activity.isCompleted( request.getIsCompleted() );
        activity.updatedBy( request.getUpdatedBy() );

        return activity.build();
    }

    @Override
    public ActivityResponseDTO toResponse(Activity activity) {
        if ( activity == null ) {
            return null;
        }

        ActivityResponseDTO.ActivityResponseDTOBuilder activityResponseDTO = ActivityResponseDTO.builder();

        activityResponseDTO.id( activity.getId() );
        activityResponseDTO.taskId( activity.getTaskId() );
        activityResponseDTO.parentId( activity.getParentId() );
        activityResponseDTO.parentType( activity.getParentType() );
        activityResponseDTO.contactId( activity.getContactId() );
        activityResponseDTO.activityType( activity.getActivityType() );
        activityResponseDTO.subject( activity.getSubject() );
        activityResponseDTO.description( activity.getDescription() );
        activityResponseDTO.callType( activity.getCallType() );
        activityResponseDTO.callResult( activity.getCallResult() );
        activityResponseDTO.startDate( activity.getStartDate() );
        activityResponseDTO.endDate( activity.getEndDate() );
        activityResponseDTO.location( activity.getLocation() );
        activityResponseDTO.duration( activity.getDuration() );
        activityResponseDTO.activityDate( activity.getActivityDate() );
        activityResponseDTO.isPriority( activity.getIsPriority() );
        activityResponseDTO.nextFollowUpDate( activity.getNextFollowUpDate() );
        activityResponseDTO.isCompleted( activity.getIsCompleted() );
        activityResponseDTO.deletedAt( activity.getDeletedAt() );
        activityResponseDTO.createdBy( activity.getCreatedBy() );
        activityResponseDTO.updatedBy( activity.getUpdatedBy() );
        activityResponseDTO.createdAt( activity.getCreatedAt() );
        activityResponseDTO.updatedAt( activity.getUpdatedAt() );

        return activityResponseDTO.build();
    }

    @Override
    public PagedResult<ActivityResponseDTO> toResponseList(PagedResult<Activity> activities) {
        if ( activities == null ) {
            return null;
        }

        PagedResult<ActivityResponseDTO> pagedResult = new PagedResult<ActivityResponseDTO>();

        pagedResult.setData( activityListToActivityResponseDTOList( activities.getData() ) );
        pagedResult.setCurrentPage( activities.getCurrentPage() );
        pagedResult.setPageSize( activities.getPageSize() );
        pagedResult.setTotalElements( activities.getTotalElements() );
        pagedResult.setTotalPages( activities.getTotalPages() );

        return pagedResult;
    }

    protected List<ActivityResponseDTO> activityListToActivityResponseDTOList(List<Activity> list) {
        if ( list == null ) {
            return null;
        }

        List<ActivityResponseDTO> list1 = new ArrayList<ActivityResponseDTO>( list.size() );
        for ( Activity activity : list ) {
            list1.add( toResponse( activity ) );
        }

        return list1;
    }
}
