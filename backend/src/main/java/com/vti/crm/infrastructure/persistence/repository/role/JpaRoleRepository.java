package com.vti.crm.infrastructure.persistence.repository.role;

import com.vti.crm.infrastructure.persistence.entity.RoleDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaRoleRepository extends JpaRepository<RoleDbEntity, Integer> {}