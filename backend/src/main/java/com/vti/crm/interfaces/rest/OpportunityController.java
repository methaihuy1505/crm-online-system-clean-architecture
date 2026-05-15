package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.opportunity.*;
import com.vti.crm.domain.model.OpportunityFilter;
import com.vti.crm.interfaces.dto.request.OpportunityRequest;
import com.vti.crm.interfaces.dto.response.OpportunityDashboardStatsResponse;
import com.vti.crm.interfaces.dto.response.OpportunityResponse;

import com.vti.crm.interfaces.dto.response.OpportunityResponseEnricher;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/opportunities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OpportunityController {

    private final CreateOpportunityUseCase createUseCase;
    private final GetOpportunityByIdUseCase getByIdUseCase;
    private final UpdateOpportunityUseCase updateUseCase;
    private final DeleteOpportunityUseCase deleteUseCase;
    private final OpportunityResponseEnricher enricher; // SỬA: đổi từ OpportunityWebMapper
    private final GetOpportunitiesWithFilterUseCase getOpportunitiesWithFilterUseCase;

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

        return ResponseEntity.ok(
                getOpportunitiesWithFilterUseCase.execute(filter)
                        .stream()
                        .map(enricher::toResponse)
                        .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpportunityResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(enricher.toResponse(getByIdUseCase.execute(id)));
    }

    @PostMapping
    public ResponseEntity<OpportunityResponse> create(
            @Valid @RequestBody OpportunityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                enricher.toResponse(
                        createUseCase.execute(
                                request.getOpportunityCode(),
                                request.getName(),
                                request.getCustomerId(),
                                request.getStageId(),
                                request.getStatusId(),
                                request.getLostReasonId(),
                                request.getDepositAmount(),
                                request.getProbability(),
                                request.getDescription()
                        )
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpportunityResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody OpportunityRequest request) {
        return ResponseEntity.ok(
                enricher.toResponse(
                        updateUseCase.execute(
                                id,
                                request.getName(),
                                request.getCustomerId(),
                                request.getStageId(),
                                request.getStatusId(),
                                request.getLostReasonId(),
                                request.getDepositAmount(),
                                request.getProbability(),
                                request.getDescription()
                        )
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        deleteUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
    private List<Integer> parseIds(String param) {
        if (param == null || param.isBlank()) return List.of();
        return Arrays.stream(param.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::parseInt)
                .toList();
    }
}