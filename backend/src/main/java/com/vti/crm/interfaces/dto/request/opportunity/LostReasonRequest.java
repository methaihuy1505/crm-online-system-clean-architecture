package com.vti.crm.interfaces.dto.request.opportunity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostReasonRequest {
    private String code;
    private String name;
    private String description;
}