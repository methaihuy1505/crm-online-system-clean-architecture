package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.opportunitystatus.*;
import com.vti.crm.interfaces.dto.request.OpportunityStatusRequest;
import com.vti.crm.interfaces.dto.response.OpportunityStatusResponse;
import com.vti.crm.interfaces.mapper.OpportunityStatusWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/opportunity-statuses")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OpportunityStatusController {

    private final CreateOpportunityStatusUseCase createUseCase;
    private final GetOpportunityStatusByIdUseCase getByIdUseCase;
    private final GetAllOpportunityStatusesUseCase getAllUseCase;
    private final UpdateOpportunityStatusUseCase updateUseCase;
    private final DeleteOpportunityStatusUseCase deleteUseCase;
    private final OpportunityStatusWebMapper webMapper;

    @GetMapping
    public List<OpportunityStatusResponse> getAll() {
        return getAllUseCase.execute()
                .stream()
                .map(webMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public OpportunityStatusResponse getById(@PathVariable Integer id) {
        return webMapper.toResponse(getByIdUseCase.execute(id));
    }

    @PostMapping
    public OpportunityStatusResponse create(@RequestBody OpportunityStatusRequest request) {
        return webMapper.toResponse(
                createUseCase.execute(
                        request.getCode(),
                        request.getName(),
                        request.getIsFinal()
                )
        );
    }

    @PutMapping("/{id}")
    public OpportunityStatusResponse update(
            @PathVariable Integer id,
            @RequestBody OpportunityStatusRequest request) {
        return webMapper.toResponse(
                updateUseCase.execute(
                        id,
                        request.getName(),
                        request.getIsFinal()
                )
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        deleteUseCase.execute(id);
    }
}