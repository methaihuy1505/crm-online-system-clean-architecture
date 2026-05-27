package com.vti.crm.interfaces.dto.request.team;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class TeamUpdateRequest {
    private Integer branchId;
    private String name;
    private Integer parentTeamId;
    private String description;
}
