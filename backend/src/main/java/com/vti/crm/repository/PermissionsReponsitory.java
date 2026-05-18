package com.vti.crm.repository;

import com.vti.crm.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionsReponsitory extends JpaRepository<Permission, Integer> {
    boolean existsByAction(String action);
}
