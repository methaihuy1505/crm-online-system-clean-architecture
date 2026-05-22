package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.leadstatus.GetAllActiveStatusesUseCase;
import com.vti.crm.interfaces.dto.response.lead.LeadStatusResponse;
import com.vti.crm.interfaces.mapper.LeadStatusWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lead-statuses")
@RequiredArgsConstructor
public class LeadStatusController {

    private final GetAllActiveStatusesUseCase getAllActiveStatusesUseCase;
    private final LeadStatusWebMapper webMapper;

    @GetMapping
    public List<LeadStatusResponse> getAllStatuses() {
        return getAllActiveStatusesUseCase.execute().stream()
                .map(webMapper::toResponse)
                .toList();
    }
}