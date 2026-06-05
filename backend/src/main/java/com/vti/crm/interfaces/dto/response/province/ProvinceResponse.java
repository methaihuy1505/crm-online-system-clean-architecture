package com.vti.crm.interfaces.dto.response.province;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProvinceResponse {
    private Integer id;
    private String name;
    private Boolean isActive;
}