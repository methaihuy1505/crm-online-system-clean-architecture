package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Branch;
import com.vti.crm.interfaces.dto.request.branch.BranchRequest;
import com.vti.crm.interfaces.dto.response.branch.BranchResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BranchWebMapper {
    BranchResponse toResponse(Branch domain);
    Branch toDomain(BranchRequest request);
}