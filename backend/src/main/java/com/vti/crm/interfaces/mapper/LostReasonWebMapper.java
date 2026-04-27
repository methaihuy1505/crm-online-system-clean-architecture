package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.LostReason;
import com.vti.crm.interfaces.dto.response.LostReasonResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LostReasonWebMapper {

    LostReasonResponse toResponse(LostReason domain);
}