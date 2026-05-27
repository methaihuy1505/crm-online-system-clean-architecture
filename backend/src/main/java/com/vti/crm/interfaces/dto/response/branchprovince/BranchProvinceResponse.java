package com.vti.crm.interfaces.dto.response.branchprovince;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BranchProvinceResponse {
    private Integer id;
    private Integer branchId;
    private String branchName;
    private Integer provinceId;
    private String provinceName;
}