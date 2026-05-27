package com.vti.crm.infrastructure.persistence.repository.team;

import com.vti.crm.infrastructure.persistence.entity.TeamDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaTeamRepository extends JpaRepository<TeamDbEntity, Integer> {}