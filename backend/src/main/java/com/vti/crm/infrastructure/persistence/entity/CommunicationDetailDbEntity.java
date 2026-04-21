package com.vti.crm.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Table(name = "communication_details")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CommunicationDetailDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Không dùng @ManyToOne vì ID này có thể của Lead, Customer hoặc Contact
    @Column(name = "parent_id", nullable = false)
    private Integer parentId;

    // Dùng Enum để ép kiểu dữ liệu chuẩn với DB
    @Enumerated(EnumType.STRING)
    @Column(name = "parent_type", nullable = false)
    private ParentType parentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "comm_type", nullable = false)
    private CommType commType;

    @Column(name = "comm_value", nullable = false)
    private String commValue;

    @Column(length = 100)
    private String label;

    @Builder.Default
    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    // --- Định nghĩa các Enum nội bộ cho bảng này ---

    public enum ParentType {
        LEAD, CUSTOMER, CONTACT
    }

    public enum CommType {
        PHONE, EMAIL, ZALO, SKYPE, FAX
    }

    public enum Status {
        ACTIVE, INACTIVE
    }
}