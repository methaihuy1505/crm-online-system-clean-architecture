package com.vti.crm.application.usecases.team;

import com.vti.crm.domain.model.Team;
import com.vti.crm.domain.repository.ITeamRepository;
import com.vti.crm.interfaces.dto.request.team.TeamCreateRequest;
import com.vti.crm.interfaces.mapper.TeamWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateTeamUseCase {
    private final ITeamRepository teamRepository;
    private final TeamWebMapper webMapper;

    public Team execute(TeamCreateRequest request) {
        Team team = webMapper.toDomain(request);
        return teamRepository.save(team);
    }
}