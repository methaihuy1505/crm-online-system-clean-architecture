package com.vti.crm.interfaces.dto.request.branch;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BranchRequest {
    @NotBlank(message = "Tên chi nhánh không được để trống")
    private String name;
    private String address;
    private String taxCode;
}