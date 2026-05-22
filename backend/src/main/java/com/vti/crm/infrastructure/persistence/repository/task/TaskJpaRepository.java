package com.vti.crm.infrastructure.persistence.repository.task;

import com.vti.crm.infrastructure.persistence.entity.TaskEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaskJpaRepository extends JpaRepository<TaskEntity, Integer> {
    Page<TaskEntity> findByDeletedAtIsNull(Pageable pageable);
    Optional<TaskEntity> findByIdAndDeletedAtIsNull(Integer id);
}
