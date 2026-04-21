package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.campaign.*;
import com.vti.crm.interfaces.dto.request.CampaignRequest;
import com.vti.crm.interfaces.dto.response.CampaignResponse;
import com.vti.crm.interfaces.mapper.CampaignWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final GetAllCampaignsUseCase getAllCampaignsUseCase;
    private final GetCampaignByIdUseCase getCampaignByIdUseCase;
    private final CreateCampaignUseCase createCampaignUseCase;
    private final UpdateCampaignUseCase updateCampaignUseCase;
    private final DeleteCampaignUseCase deleteCampaignUseCase;
    private final CampaignWebMapper webMapper;

    @GetMapping
    public ResponseEntity<List<CampaignResponse>> getAllCampaigns() {
        List<CampaignResponse> responses = getAllCampaignsUseCase.execute().stream()
                .map(webMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse> getCampaignById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getCampaignByIdUseCase.execute(id)));
    }

    @PostMapping
    public ResponseEntity<CampaignResponse> createCampaign(@RequestBody CampaignRequest request) {
        return new ResponseEntity<>(
                webMapper.toResponse(createCampaignUseCase.execute(request)),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignResponse> updateCampaign(
            @PathVariable Integer id,
            @RequestBody CampaignRequest request) {
        return ResponseEntity.ok(webMapper.toResponse(updateCampaignUseCase.execute(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Integer id) {
        deleteCampaignUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}