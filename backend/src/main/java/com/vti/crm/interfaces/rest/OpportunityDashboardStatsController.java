package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.opportunity.GetDashboardStatsUseCase;
import com.vti.crm.interfaces.dto.response.opportunity.OpportunityDashboardStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class OpportunityDashboardStatsController {

    private final GetDashboardStatsUseCase getDashboardStatsUseCase;

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasAuthority('dashboard.view')")
    public ResponseEntity<OpportunityDashboardStatsResponse> getStats() {
        return ResponseEntity.ok(getDashboardStatsUseCase.execute());
    }
}