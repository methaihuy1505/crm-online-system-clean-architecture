package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Team;
import com.vti.crm.domain.model.PagedResult;
import java.util.Optional;

public interface ITeamRepository {
    PagedResult<Team> findAll(int page, int size);
    Optional<Team> findById(Integer id);
    Team save(Team team);
    void deleteById(Integer id);
}