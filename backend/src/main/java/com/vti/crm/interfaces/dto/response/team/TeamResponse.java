package com.vti.crm.interfaces.dto.response.team;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TeamResponse {
    private Integer id;
    private String name;
    private Integer branchId;
    private String branchName; // Thuận tiện cho hiển thị
    private Integer parentTeamId;
    private String parentTeamName;
    private String description;
}