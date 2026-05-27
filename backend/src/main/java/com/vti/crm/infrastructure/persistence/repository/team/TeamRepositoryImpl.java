package com.vti.crm.infrastructure.persistence.repository.team;

import com.vti.crm.domain.model.Team;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.repository.ITeamRepository;
import com.vti.crm.infrastructure.persistence.mapper.TeamInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TeamRepositoryImpl implements ITeamRepository {
    private final JpaTeamRepository jpaRepository;
    private final TeamInfraMapper mapper;

    @Override public PagedResult<Team> findAll(int page, int size) {
        Page<Team> teamPage = jpaRepository.findAll(PageRequest.of(page, size)).map(mapper::toDomain);
        return new PagedResult<>(teamPage.getContent(), teamPage.getNumber(), teamPage.getSize(), teamPage.getTotalElements(), teamPage.getTotalPages());
    }
    @Override public Optional<Team> findById(Integer id) { return jpaRepository.findById(id).map(mapper::toDomain); }
    @Override public Team save(Team team) { return mapper.toDomain(jpaRepository.save(mapper.toEntity(team))); }
    @Override public void deleteById(Integer id) { jpaRepository.deleteById(id); }
}