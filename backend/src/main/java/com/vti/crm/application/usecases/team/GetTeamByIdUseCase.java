package com.vti.crm.application.usecases.team;

import com.vti.crm.domain.model.Team;
import com.vti.crm.domain.repository.ITeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetTeamByIdUseCase {
    private final ITeamRepository teamRepository;

    public Team execute(Integer id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm với ID: " + id));
    }
}