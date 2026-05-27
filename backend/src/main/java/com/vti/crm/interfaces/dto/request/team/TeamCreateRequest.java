package com.vti.crm.interfaces.dto.request.team;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TeamCreateRequest {
    @NotNull(message = "Chi nhánh không được để trống")
    private Integer branchId;
    @NotBlank(message = "Tên nhóm không được để trống")
    private String name;
    private Integer parentTeamId;
    private String description;
}