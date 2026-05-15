package com.vti.crm.interfaces.mapper.Activity;

import com.vti.crm.domain.model.Activity.Activity;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.interfaces.dto.request.activity.ActivityCreationRequest;
import com.vti.crm.interfaces.dto.request.activity.ActivityUpdateRequest;
import com.vti.crm.interfaces.dto.response.activity.ActivityResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityWebMapper {
    // Map từ Request DTO của Client sang Domain Entity
    Activity toDomain(ActivityCreationRequest request);
    Activity toDomain(ActivityUpdateRequest request);
    // Map từ Domain Entity sang Response DTO trả về cho Client
    ActivityResponseDTO toResponse(Activity activity);

    // Tự động map cho cả 1 List
    PagedResult<ActivityResponseDTO> toResponseList(PagedResult<Activity> activities);
}
