package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.BranchProvince;
import com.vti.crm.interfaces.dto.request.branchprovince.BranchProvinceRequest;
import com.vti.crm.interfaces.dto.response.branchprovince.BranchProvinceResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BranchProvinceWebMapper {

    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "provinceId", source = "province.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "provinceName", source = "province.name")
    BranchProvinceResponse toResponse(BranchProvince domain);

    @Mapping(target = "branch.id", source = "branchId")
    @Mapping(target = "province.id", source = "provinceId")
    BranchProvince toDomain(BranchProvinceRequest request);
}