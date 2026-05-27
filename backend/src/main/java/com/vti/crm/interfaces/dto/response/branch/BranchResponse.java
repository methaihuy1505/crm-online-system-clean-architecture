package com.vti.crm.interfaces.dto.response.branch;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BranchResponse {
    private Integer id;
    private String name;
    private String address;
    private String taxCode;
}