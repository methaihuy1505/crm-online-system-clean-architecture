package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.opportunitystage.*;
import com.vti.crm.interfaces.dto.request.OpportunityStageRequest;
import com.vti.crm.interfaces.dto.response.OpportunityStageResponse;
import com.vti.crm.interfaces.mapper.OpportunityStageWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/opportunity-stages")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OpportunityStageController {

    private final CreateOpportunityStageUseCase createUseCase;
    private final GetOpportunityStageByIdUseCase getByIdUseCase;
    private final GetAllOpportunityStagesUseCase getAllUseCase;
    private final UpdateOpportunityStageUseCase updateUseCase;
    private final DeleteOpportunityStageUseCase deleteUseCase;
    private final OpportunityStageWebMapper webMapper;

    @PostMapping
    public ResponseEntity<OpportunityStageResponse> create(
            @RequestBody OpportunityStageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                webMapper.toResponse(
                        createUseCase.execute(
                                request.getName(),
                                request.getProbabilityDefault(),
                                request.getSortOrder(),
                                request.getIsClosed()
                        )
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpportunityStageResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getByIdUseCase.execute(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpportunityStageResponse> update(
            @PathVariable Integer id,
            @RequestBody OpportunityStageRequest request) {
        return ResponseEntity.ok(
                webMapper.toResponse(
                        updateUseCase.execute(
                                id,
                                request.getName(),
                                request.getProbabilityDefault(),
                                -1,
                                request.getIsClosed()
                        )
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        deleteUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(
                getAllUseCase.execute()
                        .stream()
                        .map(webMapper::toResponse)
                        .toList()
        );
    }
}