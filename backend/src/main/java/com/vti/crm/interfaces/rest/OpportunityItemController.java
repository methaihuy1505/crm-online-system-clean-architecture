package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.opportunityitem.*;
import com.vti.crm.interfaces.dto.request.OpportunityItemRequest;
import com.vti.crm.interfaces.dto.response.OpportunityItemResponse;
import com.vti.crm.interfaces.mapper.OpportunityItemWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/opportunity-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OpportunityItemController {

    private final CreateOpportunityItemUseCase createUseCase;
    private final GetOpportunityItemByIdUseCase getByIdUseCase;
    private final GetAllOpportunityItemsUseCase getAllUseCase;
    private final GetOpportunityItemsByOpportunityIdUseCase getByOpportunityIdUseCase;
    private final UpdateOpportunityItemUseCase updateUseCase;
    private final DeleteOpportunityItemUseCase deleteUseCase;
    private final OpportunityItemWebMapper webMapper;
//
//    @GetMapping
//    public ResponseEntity<List<OpportunityItemResponse>> getAll() {
//        return ResponseEntity.ok(
//                getAllUseCase.execute().stream().map(webMapper::toResponse).toList()
//        );
//    }

    @GetMapping("/{id}")
    public ResponseEntity<OpportunityItemResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getByIdUseCase.execute(id)));
    }

    @GetMapping("/opportunity/{opportunityId}")
    public ResponseEntity<List<OpportunityItemResponse>> getByOpportunityId(
            @PathVariable Integer opportunityId) {
        return ResponseEntity.ok(
                getByOpportunityIdUseCase.execute(opportunityId)
                        .stream().map(webMapper::toResponse).toList()
        );
    }

    @PostMapping
    public ResponseEntity<OpportunityItemResponse> create(
            @RequestBody OpportunityItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                webMapper.toResponse(
                        createUseCase.execute(
                                request.getOpportunityId(),
                                request.getProductId(),
                                request.getQuantity(),
                                request.getUnitPrice(),
                                request.getVatRate(),
                                request.getDiscountRate(),
                                request.getLineItemNumber(),
                                request.getNote()
                        )
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpportunityItemResponse> update(
            @PathVariable Integer id,
            @RequestBody OpportunityItemRequest request) {
        return ResponseEntity.ok(
                webMapper.toResponse(
                        updateUseCase.execute(
                                id,
                                request.getProductId(),
                                request.getQuantity(),
                                request.getUnitPrice(),
                                request.getVatRate(),
                                request.getDiscountRate(),
                                request.getLineItemNumber(),
                                request.getNote()
                        )
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        deleteUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}