package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.opportunity.*;
import com.vti.crm.domain.model.OpportunityFilter;
import com.vti.crm.interfaces.dto.request.opportunity.OpportunityRequest;
import com.vti.crm.interfaces.dto.response.opportunity.OpportunityResponse;
import com.vti.crm.interfaces.dto.response.opportunity.OpportunityResponseEnricher;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/opportunities")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('opportunities.view')")
public class OpportunityController {

    private final CreateOpportunityUseCase createUseCase;
    private final GetOpportunityByIdUseCase getByIdUseCase;
    private final UpdateOpportunityUseCase updateUseCase;
    private final DeleteOpportunityUseCase deleteUseCase;
    private final GetOpportunitiesWithFilterUseCase getOpportunitiesWithFilterUseCase;
    private final OpportunityResponseEnricher enricher;

    @GetMapping
    public ResponseEntity<List<OpportunityResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String stageIds,
            @RequestParam(required = false) String statusIds,
            @RequestParam(required = false) String reasonIds,
            @RequestParam(required = false) String sort) {

        OpportunityFilter filter = new OpportunityFilter(
                search,
                parseIds(stageIds),
                parseIds(statusIds),
                parseIds(reasonIds),
                sort
        );

        // toResponses() — batch load, chỉ 3 query DB
        return ResponseEntity.ok(
                enricher.toResponses(getOpportunitiesWithFilterUseCase.execute(filter))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpportunityResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(enricher.toResponse(getByIdUseCase.execute(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('opportunities.create')")
    public ResponseEntity<OpportunityResponse> create(
            @Valid @RequestBody OpportunityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                enricher.toResponse(
                        createUseCase.execute(
                                request.getOpportunityCode(),
                                request.getName(),
                                request.getCustomerId(),
                                request.getCampaignId(),
                                request.getStageId(),
                                request.getStatusId(),
                                request.getLostReasonId(),
                                request.getDepositAmount(),
                                request.getProbability(),
                                request.getDescription(),
                                request.getNextFollowUpDate(),
                                request.getExpectedCloseDate(),
                                request.getCreatedBy(),
                                request.getAssignedTo()
                        )
                )
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('opportunities.update')")
    public ResponseEntity<OpportunityResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody OpportunityRequest request) {
        return ResponseEntity.ok(
                enricher.toResponse(
                        updateUseCase.execute(
                                id,
                                request.getName(),
                                request.getCustomerId(),
                                request.getCampaignId(),
                                request.getStageId(),
                                request.getStatusId(),
                                request.getLostReasonId(),
                                request.getDepositAmount(),
                                request.getProbability(),
                                request.getDescription(),
                                request.getNextFollowUpDate(),
                                request.getCurrencyCode(),
                                request.getExpectedCloseDate(),
                                request.getActualCloseDate(),
                                request.getAssignedTo(),
                                request.getUpdatedBy()
                        )
                )
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('opportunities.delete')")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id,
            @RequestParam(value = "deletedBy", required = false) Integer deletedBy) {
        deleteUseCase.execute(id, deletedBy);
        return ResponseEntity.noContent().build();
    }

    // ── Helper ───────────────────────────────────────────────────────────────
    private List<Integer> parseIds(String param) {
        if (param == null || param.isBlank()) return List.of();
        return Arrays.stream(param.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::parseInt)
                .toList();
    }
}