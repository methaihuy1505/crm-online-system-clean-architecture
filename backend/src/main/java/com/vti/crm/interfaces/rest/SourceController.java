package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.source.GetAllActiveSourcesUseCase;
import com.vti.crm.interfaces.dto.response.SourceResponse;
import com.vti.crm.interfaces.mapper.SourceWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sources")
@RequiredArgsConstructor
public class SourceController {

    private final GetAllActiveSourcesUseCase getAllActiveSourcesUseCase;
    private final SourceWebMapper webMapper;

    @GetMapping
    public List<SourceResponse> getAllSources() {
        return getAllActiveSourcesUseCase.execute().stream()
                .map(webMapper::toResponse)
                .toList();
    }
}