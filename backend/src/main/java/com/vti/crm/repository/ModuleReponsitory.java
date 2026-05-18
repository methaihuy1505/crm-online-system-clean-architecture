package com.vti.crm.repository;

import com.vti.crm.entity.Modules;
import com.vti.crm.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleReponsitory extends JpaRepository<Modules, Integer> {

    boolean existsByCode(String code);
}
