package com.vti.crm.interfaces.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CampaignStatsResponse {
    private long totalCampaigns;
    private long ongoingCampaigns;
    private long totalLeads;
    private BigDecimal expectedRevenue;
    private BigDecimal actualRevenue;
}
