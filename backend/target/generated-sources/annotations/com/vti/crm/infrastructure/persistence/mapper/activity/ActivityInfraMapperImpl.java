package com.vti.crm.infrastructure.persistence.mapper.activity;

import com.vti.crm.domain.model.Activity.Activity;
import com.vti.crm.infrastructure.persistence.entity.activity.ActivityEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-18T16:43:48+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Microsoft)"
)
@Component
public class ActivityInfraMapperImpl implements ActivityInfraMapper {

    @Override
    public Activity toDomain(ActivityEntity entity) {
        if ( entity == null ) {
            return null;
        }

        Activity.ActivityBuilder activity = Activity.builder();

        activity.id( entity.getId() );
        activity.taskId( entity.getTaskId() );
        activity.parentId( entity.getParentId() );
        activity.parentType( parentTypeToParentType( entity.getParentType() ) );
        activity.contactId( entity.getContactId() );
        activity.activityType( activityTypeToActivityType( entity.getActivityType() ) );
        activity.subject( entity.getSubject() );
        activity.description( entity.getDescription() );
        activity.callType( callTypeToCallType( entity.getCallType() ) );
        activity.callResult( entity.getCallResult() );
        activity.startDate( entity.getStartDate() );
        activity.endDate( entity.getEndDate() );
        activity.location( entity.getLocation() );
        activity.duration( entity.getDuration() );
        activity.activityDate( entity.getActivityDate() );
        activity.isPriority( entity.getIsPriority() );
        activity.nextFollowUpDate( entity.getNextFollowUpDate() );
        activity.isCompleted( entity.getIsCompleted() );
        activity.deletedAt( entity.getDeletedAt() );
        activity.createdBy( entity.getCreatedBy() );
        activity.createdAt( entity.getCreatedAt() );
        activity.updatedBy( entity.getUpdatedBy() );
        activity.updatedAt( entity.getUpdatedAt() );

        return activity.build();
    }

    @Override
    public ActivityEntity toEntity(Activity domain) {
        if ( domain == null ) {
            return null;
        }

        ActivityEntity.ActivityEntityBuilder activityEntity = ActivityEntity.builder();

        activityEntity.id( domain.getId() );
        activityEntity.taskId( domain.getTaskId() );
        activityEntity.parentId( domain.getParentId() );
        activityEntity.parentType( parentTypeToParentType1( domain.getParentType() ) );
        activityEntity.contactId( domain.getContactId() );
        activityEntity.activityType( activityTypeToActivityType1( domain.getActivityType() ) );
        activityEntity.subject( domain.getSubject() );
        activityEntity.description( domain.getDescription() );
        activityEntity.callType( callTypeToCallType1( domain.getCallType() ) );
        activityEntity.callResult( domain.getCallResult() );
        activityEntity.startDate( domain.getStartDate() );
        activityEntity.endDate( domain.getEndDate() );
        activityEntity.location( domain.getLocation() );
        activityEntity.duration( domain.getDuration() );
        activityEntity.activityDate( domain.getActivityDate() );
        activityEntity.isPriority( domain.getIsPriority() );
        activityEntity.nextFollowUpDate( domain.getNextFollowUpDate() );
        activityEntity.isCompleted( domain.getIsCompleted() );
        activityEntity.deletedAt( domain.getDeletedAt() );
        activityEntity.createdAt( domain.getCreatedAt() );
        activityEntity.createdBy( domain.getCreatedBy() );
        activityEntity.updatedAt( domain.getUpdatedAt() );
        activityEntity.updatedBy( domain.getUpdatedBy() );

        return activityEntity.build();
    }

    protected Activity.ParentType parentTypeToParentType(ActivityEntity.ParentType parentType) {
        if ( parentType == null ) {
            return null;
        }

        Activity.ParentType parentType1;

        switch ( parentType ) {
            case LEAD: parentType1 = Activity.ParentType.LEAD;
            break;
            case CUSTOMER: parentType1 = Activity.ParentType.CUSTOMER;
            break;
            case OPPORTUNITY: parentType1 = Activity.ParentType.OPPORTUNITY;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + parentType );
        }

        return parentType1;
    }

    protected Activity.ActivityType activityTypeToActivityType(ActivityEntity.ActivityType activityType) {
        if ( activityType == null ) {
            return null;
        }

        Activity.ActivityType activityType1;

        switch ( activityType ) {
            case CALL: activityType1 = Activity.ActivityType.CALL;
            break;
            case MEETING: activityType1 = Activity.ActivityType.MEETING;
            break;
            case NOTE: activityType1 = Activity.ActivityType.NOTE;
            break;
            case EMAIL_QUOTE: activityType1 = Activity.ActivityType.EMAIL_QUOTE;
            break;
            case EMAIL_TRANSACTION: activityType1 = Activity.ActivityType.EMAIL_TRANSACTION;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + activityType );
        }

        return activityType1;
    }

    protected Activity.CallType callTypeToCallType(ActivityEntity.CallType callType) {
        if ( callType == null ) {
            return null;
        }

        Activity.CallType callType1;

        switch ( callType ) {
            case INBOUND: callType1 = Activity.CallType.INBOUND;
            break;
            case OUTBOUND: callType1 = Activity.CallType.OUTBOUND;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + callType );
        }

        return callType1;
    }

    protected ActivityEntity.ParentType parentTypeToParentType1(Activity.ParentType parentType) {
        if ( parentType == null ) {
            return null;
        }

        ActivityEntity.ParentType parentType1;

        switch ( parentType ) {
            case LEAD: parentType1 = ActivityEntity.ParentType.LEAD;
            break;
            case CUSTOMER: parentType1 = ActivityEntity.ParentType.CUSTOMER;
            break;
            case OPPORTUNITY: parentType1 = ActivityEntity.ParentType.OPPORTUNITY;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + parentType );
        }

        return parentType1;
    }

    protected ActivityEntity.ActivityType activityTypeToActivityType1(Activity.ActivityType activityType) {
        if ( activityType == null ) {
            return null;
        }

        ActivityEntity.ActivityType activityType1;

        switch ( activityType ) {
            case CALL: activityType1 = ActivityEntity.ActivityType.CALL;
            break;
            case MEETING: activityType1 = ActivityEntity.ActivityType.MEETING;
            break;
            case NOTE: activityType1 = ActivityEntity.ActivityType.NOTE;
            break;
            case EMAIL_QUOTE: activityType1 = ActivityEntity.ActivityType.EMAIL_QUOTE;
            break;
            case EMAIL_TRANSACTION: activityType1 = ActivityEntity.ActivityType.EMAIL_TRANSACTION;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + activityType );
        }

        return activityType1;
    }

    protected ActivityEntity.CallType callTypeToCallType1(Activity.CallType callType) {
        if ( callType == null ) {
            return null;
        }

        ActivityEntity.CallType callType1;

        switch ( callType ) {
            case INBOUND: callType1 = ActivityEntity.CallType.INBOUND;
            break;
            case OUTBOUND: callType1 = ActivityEntity.CallType.OUTBOUND;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + callType );
        }

        return callType1;
    }
}
