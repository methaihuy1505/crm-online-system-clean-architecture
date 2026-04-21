package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.infrastructure.persistence.entity.SourceDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaSourceRepository extends JpaRepository<SourceDbEntity, Integer> {
    List<SourceDbEntity> findByIsActiveTrue();
}
