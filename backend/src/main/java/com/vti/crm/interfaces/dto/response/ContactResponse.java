package com.vti.crm.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactResponse {
    private Integer id;
    private Integer customerId;
    private String customerName; // Lấy thêm tên công ty để hiển thị cho đẹp
    private String firstName;
    private String lastName;
    private String fullName;
    private String jobTitle;
    private LocalDate birthday;
    private String personalEmail;
    private String personalPhone;
    private Boolean isPrimary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}