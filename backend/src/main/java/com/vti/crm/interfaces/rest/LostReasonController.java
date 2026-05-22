package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.lostreason.*;
import com.vti.crm.interfaces.dto.request.opportunity.LostReasonRequest;
import com.vti.crm.interfaces.dto.response.opportunity.LostReasonResponse;
import com.vti.crm.interfaces.mapper.LostReasonWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/lost-reasons")
@RequiredArgsConstructor
@CrossOrigin("*")
public class LostReasonController {

    private final CreateLostReasonUseCase createUseCase;
    private final GetLostReasonByIdUseCase getByIdUseCase;
    private final GetAllLostReasonsUseCase getAllUseCase;
    private final UpdateLostReasonUseCase updateUseCase;
    private final DeleteLostReasonUseCase deleteUseCase;
    private final LostReasonWebMapper webMapper;

    @GetMapping
    public List<LostReasonResponse> getAll() {
        return getAllUseCase.execute()
                .stream()
                .map(webMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public LostReasonResponse getById(@PathVariable Integer id) {
        return webMapper.toResponse(getByIdUseCase.execute(id));
    }

    @PostMapping
    public LostReasonResponse create(@RequestBody LostReasonRequest request) {
        return webMapper.toResponse(
                createUseCase.execute(request.getCode(), request.getName(), request.getDescription())
        );
    }

    @PutMapping("/{id}")
    public LostReasonResponse update(
            @PathVariable Integer id,
            @RequestBody LostReasonRequest request) {
        return webMapper.toResponse(
                updateUseCase.execute(id, request.getName(), request.getDescription())
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        deleteUseCase.execute(id);
    }
}