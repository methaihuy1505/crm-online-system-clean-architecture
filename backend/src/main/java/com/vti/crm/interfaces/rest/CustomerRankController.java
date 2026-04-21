package com.vti.crm.controller;

import com.vti.crm.entity.CustomerRank;
import com.vti.crm.repository.CustomerRankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer-ranks")
@RequiredArgsConstructor
public class CustomerRankController {

    private final CustomerRankRepository customerRankRepository;

    @GetMapping
    public ResponseEntity<List<CustomerRank>> getAllRanks() {
        return ResponseEntity.ok(customerRankRepository.findAll());
    }
}