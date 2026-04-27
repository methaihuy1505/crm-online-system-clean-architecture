package com.vti.crm.application.usecases.opportunity;

import com.vti.crm.domain.service.OpportunityDashboardDomainService;
import com.vti.crm.domain.service.OpportunityDashboardDomainService.DashboardStats;
import com.vti.crm.interfaces.dto.response.OpportunityDashboardStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetDashboardStatsUseCase {

    private final OpportunityDashboardDomainService dashboardDomainService;

    public OpportunityDashboardStatsResponse execute() {
        DashboardStats stats = dashboardDomainService.calculateStats();
        return OpportunityDashboardStatsResponse.builder()
                .totalPipeline(formatToCurrency(stats.totalPipeline))
                .pipelineTrend(formatTrend(stats.growthRate))
                .pipelineTrendIcon(stats.growthRate >= 0 ? "trending_up" : "trending_down")
                .activeLeads(String.valueOf(stats.activeLeads))
                .avgDealSize(formatToK(stats.avgDealSize))
                .conversionRate(String.format("%.1f%%", stats.conversionRate))
                .build();
    }

    // Format helper — đây là logic trình bày (presentation), đúng chỗ ở UseCase/tầng trên Domain
    private String formatToCurrency(double value) {
        if (value >= 1_000_000) return String.format("$%.1fM", value / 1_000_000);
        if (value >= 1_000)     return String.format("$%.1fk", value / 1_000);
        return String.format("$%.0f", value);
    }

    private String formatToK(double value) {
        if (value >= 1_000) return String.format("$%.1fk", value / 1_000);
        return String.format("$%.1f", value);
    }

    private String formatTrend(double growthRate) {
        return String.format("%s%.1f%% vs last month", growthRate >= 0 ? "+" : "", growthRate);
    }
}