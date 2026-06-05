package com.vti.crm.infrastructure.persistence.repository.role;

import com.vti.crm.infrastructure.persistence.entity.RoleDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaRoleRepository extends JpaRepository<RoleDbEntity, Integer> {

}