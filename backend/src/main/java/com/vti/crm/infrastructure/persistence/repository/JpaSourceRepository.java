package com.vti.crm.repository;

import com.vti.crm.entity.Source;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SourceRepository extends JpaRepository<Source, Integer> {
    List<Source> findByIsActiveTrue();
}
