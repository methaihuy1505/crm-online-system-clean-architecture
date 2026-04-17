package com.vti.crm.interfaces.dto.response;


import lombok.Data;

@Data
public class CustomerResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String status;
}
