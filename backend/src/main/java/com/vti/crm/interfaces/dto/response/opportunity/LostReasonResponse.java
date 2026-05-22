package com.vti.crm.interfaces.dto.response.opportunity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostReasonResponse {
    private Integer id;
    private String code;
    private String name;
    private String description;
}
