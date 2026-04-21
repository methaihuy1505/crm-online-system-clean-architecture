package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.lead.*;
import com.vti.crm.interfaces.dto.request.LeadCreateRequest;
import com.vti.crm.interfaces.dto.request.LeadUpdateRequest;
import com.vti.crm.interfaces.dto.response.LeadResponse;
import com.vti.crm.interfaces.mapper.LeadWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leads")
@RequiredArgsConstructor
public class LeadController {

    // Tiêm đủ 5 UseCases tương ứng với 5 hành động
    private final CreateLeadUseCase createLeadUseCase;
    private final GetAllLeadsUseCase getAllLeadsUseCase;
    private final GetLeadByIdUseCase getLeadByIdUseCase;
    private final UpdateLeadUseCase updateLeadUseCase;
    private final DeleteLeadUseCase deleteLeadUseCase;

    // Mapper để chuyển từ Model sang Response
    private final LeadWebMapper webMapper;

    @PostMapping
    public ResponseEntity<LeadResponse> createLead(@RequestBody LeadCreateRequest request) {
        LeadResponse response = webMapper.toResponse(createLeadUseCase.execute(request));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LeadResponse>> getAllLeads() {
        List<LeadResponse> leads = getAllLeadsUseCase.execute().stream()
                .map(webMapper::toResponse)
                .toList();
        return ResponseEntity.ok(leads);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLeadById(@PathVariable Integer id) {
        LeadResponse response = webMapper.toResponse(getLeadByIdUseCase.execute(id));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> updateLead(
            @PathVariable Integer id,
            @RequestBody LeadUpdateRequest request) {
        LeadResponse response = webMapper.toResponse(updateLeadUseCase.execute(id, request));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Integer id) {
        deleteLeadUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}