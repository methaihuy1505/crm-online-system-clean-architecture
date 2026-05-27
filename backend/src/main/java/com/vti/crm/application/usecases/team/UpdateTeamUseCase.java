package com.vti.crm.application.usecases.team;

import com.vti.crm.domain.model.Team;
import com.vti.crm.domain.repository.ITeamRepository;
import com.vti.crm.interfaces.dto.request.team.TeamCreateRequest;
import com.vti.crm.interfaces.mapper.TeamWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateTeamUseCase {
    private final ITeamRepository teamRepository;
    private final TeamWebMapper webMapper;

    public Team execute(Integer id, TeamCreateRequest request) {
        teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm để cập nhật"));

        Team team = webMapper.toDomain(request);
        team.setId(id);
        return teamRepository.save(team);
    }
}