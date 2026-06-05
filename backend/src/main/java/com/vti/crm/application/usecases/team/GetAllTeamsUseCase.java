package com.vti.crm.application.usecases.team;

import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Team;
import com.vti.crm.domain.repository.ITeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetAllTeamsUseCase {
    private final ITeamRepository teamRepository;

    public Page<Team> execute(Pageable pageable) {
        PagedResult<Team> result = teamRepository.findAll(pageable.getPageNumber(), pageable.getPageSize());

        return new PageImpl<>(result.getData(), pageable, result.getTotalElements());
    }
}