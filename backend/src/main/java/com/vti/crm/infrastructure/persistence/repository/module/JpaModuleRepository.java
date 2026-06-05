package com.vti.crm.infrastructure.persistence.repository.module;

import com.vti.crm.infrastructure.persistence.entity.ModuleDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaModuleRepository extends JpaRepository<ModuleDbEntity, Integer> {

    @Query("SELECT m FROM ModuleDbEntity m WHERE m.isActive = true ORDER BY m.sortOrder ASC")
    List<ModuleDbEntity> findAllActiveOrderBySortOrder();
}
