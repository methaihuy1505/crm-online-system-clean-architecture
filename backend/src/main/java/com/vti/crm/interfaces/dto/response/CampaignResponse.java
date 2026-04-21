package com.vti.crm.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignResponse {
    private Integer id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

    private Long totalLeads;
    private Long totalCustomers;
    private Double expectedRevenue;
    private Double actualRevenue;
}