package com.vti.crm.controller;

import com.vti.crm.dto.request.LeadCreateRequest;
import com.vti.crm.dto.request.LeadUpdateRequest;
import com.vti.crm.dto.response.LeadResponse;
import com.vti.crm.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public ResponseEntity<LeadResponse> createLead(@RequestBody LeadCreateRequest request) {
        LeadResponse response = leadService.createLead(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LeadResponse>> getAllLeads() {
        List<LeadResponse> leads = leadService.getAllLeads();
        return ResponseEntity.ok(leads);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLeadById(@PathVariable Integer id) {
        LeadResponse response = leadService.getLeadById(id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> updateLead(
            @PathVariable Integer id,
            @RequestBody LeadUpdateRequest request) {
        LeadResponse response = leadService.updateLead(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Integer id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build(); // Trả về 204 No Content cho Delete
    }
}