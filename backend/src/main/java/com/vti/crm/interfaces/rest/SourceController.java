package com.vti.crm.controller;

import com.vti.crm.entity.Source;
import com.vti.crm.repository.SourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sources")
@RequiredArgsConstructor
public class SourceController {

    private final SourceRepository sourceRepository;

    @GetMapping
    public List<Source> getAllSources() {
        // Chỉ lấy các nguồn đang Active
        return sourceRepository.findByIsActiveTrue();
    }
}