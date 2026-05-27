package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Team;
import com.vti.crm.interfaces.dto.request.team.TeamCreateRequest;
import com.vti.crm.interfaces.dto.response.team.TeamResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TeamWebMapper {

    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "parentTeamName", source = "parentTeam.name")
    TeamResponse toResponse(Team domain);

    @Mapping(target = "branch.id", source = "branchId")
    @Mapping(target = "parentTeam.id", source = "parentTeamId")
    Team toDomain(TeamCreateRequest request);
}