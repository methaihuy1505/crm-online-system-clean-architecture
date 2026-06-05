package com.vti.crm.infrastructure.persistence.repository.province;

import com.vti.crm.infrastructure.persistence.entity.ProvinceDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaProvinceRepository extends JpaRepository<ProvinceDbEntity, Integer> {}