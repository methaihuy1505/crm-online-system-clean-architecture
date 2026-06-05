package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Activity;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.interfaces.dto.request.activity.ActivityCreationRequest;
import com.vti.crm.interfaces.dto.request.activity.ActivityUpdateRequest;
import com.vti.crm.interfaces.dto.response.activity.ActivityResponseDTO;
import com.vti.crm.interfaces.dto.response.activity.ActivityDetailsResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityWebMapper {
    Activity toDomain(ActivityCreationRequest request);
    Activity toDomain(ActivityUpdateRequest request);

    ActivityResponseDTO toResponse(Activity activity);

    ActivityDetailsResponseDTO toDetailsResponse(Activity activity);
    PagedResult<ActivityDetailsResponseDTO> toDetailsResponseList(PagedResult<Activity> activities);

    PagedResult<ActivityResponseDTO> toResponseList(PagedResult<Activity> activities);
}