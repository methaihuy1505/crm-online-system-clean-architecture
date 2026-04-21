package com.vti.crm.controller;

import com.vti.crm.entity.CustomerStatus;
import com.vti.crm.repository.CustomerStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer-statuses")
@RequiredArgsConstructor
public class CustomerStatusController {

    private final CustomerStatusRepository customerStatusRepository;

    @GetMapping
    public ResponseEntity<List<CustomerStatus>> getAllStatuses() {
        return ResponseEntity.ok(customerStatusRepository.findAll());
    }
}