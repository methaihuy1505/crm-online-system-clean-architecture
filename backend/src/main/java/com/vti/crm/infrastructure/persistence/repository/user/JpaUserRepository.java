package com.vti.crm.infrastructure.persistence.repository.user;

import com.vti.crm.infrastructure.persistence.entity.UserDbEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaUserRepository extends JpaRepository<UserDbEntity, Integer>, JpaSpecificationExecutor<UserDbEntity> {
    Optional<UserDbEntity> findByUsername(String username);
    Optional<UserDbEntity> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Page<UserDbEntity> findAll(Pageable pageable);
}
