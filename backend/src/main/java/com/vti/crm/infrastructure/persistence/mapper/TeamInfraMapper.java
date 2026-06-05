package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Team;
import com.vti.crm.infrastructure.persistence.entity.TeamDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {BranchInfraMapper.class})
public interface TeamInfraMapper {
    @Mapping(target = "parentTeam.parentTeam", ignore = true)
    Team toDomain(TeamDbEntity entity);

    @Mapping(target = "parentTeam.parentTeam", ignore = true)
    TeamDbEntity toEntity(Team domain);
}