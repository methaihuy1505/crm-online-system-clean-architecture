package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.campaign.*;
import com.vti.crm.interfaces.dto.request.campaign.CampaignRequest;
import com.vti.crm.interfaces.dto.response.campaign.CampaignResponse;
import com.vti.crm.interfaces.dto.response.campaign.CampaignStatsResponse;
import com.vti.crm.interfaces.mapper.CampaignWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final GetAllCampaignsUseCase getAllCampaignsUseCase;
    private final GetCampaignByIdUseCase getCampaignByIdUseCase;
    private final CreateCampaignUseCase createCampaignUseCase;
    private final UpdateCampaignUseCase updateCampaignUseCase;
    private final DeleteCampaignUseCase deleteCampaignUseCase;
    private final CampaignStatsUseCase campaignStatsUseCase;
    private final GetCampaignOptionsUseCase getCampaignOptionsUseCase;
    private final CampaignWebMapper webMapper;

    @GetMapping
    public ResponseEntity<Page<CampaignResponse>> getAllCampaigns(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<String> statuses, // Đã đổi thành List
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable
    ) {
        Page<CampaignResponse> responses = getAllCampaignsUseCase.execute(keyword, statuses, fromDate, toDate, pageable)
                .map(webMapper::toResponse);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAuthority('campaigns.statistics')")
    public ResponseEntity<CampaignStatsResponse> getCampaignStatistics() {
        return ResponseEntity.ok(campaignStatsUseCase.execute());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse> getCampaignById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getCampaignByIdUseCase.execute(id)));
    }

    @GetMapping("/options")
    @PreAuthorize("hasAuthority('campaigns.options')")
    public ResponseEntity<List<CampaignResponse>> getCampaignOptions(
            @RequestParam(required = false, defaultValue = "100") int limit
    ) {
        List<CampaignResponse> responses = getCampaignOptionsUseCase.execute(limit)
                .stream()
                .map(webMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('campaigns.create')")
    public ResponseEntity<CampaignResponse> createCampaign(@RequestBody CampaignRequest request) {
        return new ResponseEntity<>(
                webMapper.toResponse(createCampaignUseCase.execute(request)),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('campaigns.update')")
    public ResponseEntity<CampaignResponse> updateCampaign(
            @PathVariable Integer id,
            @RequestBody CampaignRequest request) {
        return ResponseEntity.ok(webMapper.toResponse(updateCampaignUseCase.execute(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('campaigns.delete')")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Integer id) {
        deleteCampaignUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}