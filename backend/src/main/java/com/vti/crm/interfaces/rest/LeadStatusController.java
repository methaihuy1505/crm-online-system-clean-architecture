package com.vti.crm.controller;

import com.vti.crm.entity.LeadStatus;
import com.vti.crm.repository.LeadStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lead-statuses")
@RequiredArgsConstructor
public class LeadStatusController {

    private final LeadStatusRepository leadStatusRepository;

    @GetMapping
    public List<LeadStatus> getAllStatuses() {
        // Chỉ lấy các trạng thái đang Active
        return leadStatusRepository.findByIsActiveTrue();
    }
}