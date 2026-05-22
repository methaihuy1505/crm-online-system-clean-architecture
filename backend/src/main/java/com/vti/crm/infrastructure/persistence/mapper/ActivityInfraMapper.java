package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Activity;
import com.vti.crm.infrastructure.persistence.entity.ActivityEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityInfraMapper {
    Activity toDomain(ActivityEntity entity);

    ActivityEntity toEntity(Activity domain);
}
