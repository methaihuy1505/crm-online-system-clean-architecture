package com.vti.crm.domain.service;

import com.vti.crm.domain.repository.IOpportunityRepository;

import java.time.LocalDateTime;
import java.util.List;

public class OpportunityDashboardDomainService {

    private final IOpportunityRepository opportunityRepository;

    public OpportunityDashboardDomainService(IOpportunityRepository opportunityRepository) {
        this.opportunityRepository = opportunityRepository;
    }

    public DashboardStats calculateStats() {
        LocalDateTime now              = LocalDateTime.now();
        LocalDateTime startOfThisMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfLastMonth = startOfThisMonth.minusMonths(1);
        LocalDateTime endOfLastMonth   = startOfThisMonth.minusNanos(1);

        double totalPipeline   = resolveDouble(opportunityRepository.sumAllTotalAmount());
        double thisMonthAmount = resolveDouble(opportunityRepository.sumTotalAmountByDateRange(startOfThisMonth, now));
        double lastMonthAmount = resolveDouble(opportunityRepository.sumTotalAmountByDateRange(startOfLastMonth, endOfLastMonth));

        double growthRate = calculateGrowthRate(thisMonthAmount, lastMonthAmount);
        long activeLeads  = opportunityRepository.countByStatusIn(List.of(1, 2, 3));
        double avgDeal    = calculateAvgDeal(opportunityRepository.getSumAndCountByDateRange(startOfThisMonth, now));
        double convRate   = calculateConversionRate(opportunityRepository.countClosedOpportunities());

        return new DashboardStats(totalPipeline, growthRate, activeLeads, avgDeal, convRate);
    }

    // ============ PRIVATE — Business Rules ============

    private double resolveDouble(Double value) {
        return value != null ? value : 0.0;
    }

    private double calculateGrowthRate(double thisMonth, double lastMonth) {
        if (lastMonth > 0) return ((thisMonth - lastMonth) / lastMonth) * 100;
        return thisMonth > 0 ? 100.0 : 0.0;
    }

    private double calculateAvgDeal(Object[] raw) {
        if (raw == null) return 0.0;
        Double sum  = raw[0] != null ? (Double) raw[0] : 0.0;
        Long count  = raw[1] != null ? (Long) raw[1] : 0L;
        return count > 0 ? sum / count : 0.0;
    }

    private double calculateConversionRate(List<Object[]> data) {
        long won = 0, lost = 0;
        for (Object[] row : data) {
            if ("Won".equalsIgnoreCase((String) row[0]))  won  = (long) row[1];
            if ("Lost".equalsIgnoreCase((String) row[0])) lost = (long) row[1];
        }
        return (won + lost > 0) ? ((double) won / (won + lost)) * 100 : 0.0;
    }

    // Value Object trả về từ domain — pure data, không phụ thuộc Spring
    public static class DashboardStats {
        public final double totalPipeline;
        public final double growthRate;
        public final long   activeLeads;
        public final double avgDealSize;
        public final double conversionRate;

        public DashboardStats(double totalPipeline, double growthRate,
                              long activeLeads, double avgDealSize, double conversionRate) {
            this.totalPipeline  = totalPipeline;
            this.growthRate     = growthRate;
            this.activeLeads    = activeLeads;
            this.avgDealSize    = avgDealSize;
            this.conversionRate = conversionRate;
        }
    }
}