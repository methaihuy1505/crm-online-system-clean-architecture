package com.vti.crm.interfaces.dto.request.province;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProvinceRequest {
    @NotBlank(message = "Tên tỉnh/thành không được để trống")
    private String name;
    private Boolean isActive = true;
}