package com.vti.crm.interfaces.dto.request.branchprovince;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BranchProvinceRequest {
    @NotNull(message = "Chi nhánh không được để trống")
    private Integer branchId;
    @NotNull(message = "Tỉnh/Thành không được để trống")
    private Integer provinceId;
}