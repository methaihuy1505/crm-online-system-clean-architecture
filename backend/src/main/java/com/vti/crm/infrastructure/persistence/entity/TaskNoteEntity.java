package com.vti.crm.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskNoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name = "task_id", nullable = false)
    private Integer taskId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    @Column(name = "updated_at")
    private LocalDateTime updateAt;
}
