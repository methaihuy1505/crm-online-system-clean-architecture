package com.vti.crm.infrastructure.persistence.mapper.activity;

import com.vti.crm.domain.model.Activity.Activity;
import com.vti.crm.infrastructure.persistence.entity.activity.ActivityEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityInfraMapper {
    Activity toDomain(ActivityEntity entity);

    ActivityEntity toEntity(Activity domain);
}
