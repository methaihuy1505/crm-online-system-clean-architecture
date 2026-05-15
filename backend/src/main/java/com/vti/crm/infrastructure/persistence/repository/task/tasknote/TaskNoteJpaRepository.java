package com.vti.crm.infrastructure.persistence.repository.task.tasknote;

import com.vti.crm.infrastructure.persistence.entity.task.TaskNoteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaskNoteJpaRepository extends JpaRepository<TaskNoteEntity, Integer> {
    Page<TaskNoteEntity> findByDeletedAtIsNull(Pageable pageable);
    Optional<TaskNoteEntity> findByIdAndDeletedAtIsNull(Integer id);
}
