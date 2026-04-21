package com.vti.crm.application.usecases.source;

import com.vti.crm.domain.model.Source;
import com.vti.crm.domain.repository.ISourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllActiveSourcesUseCase {
    private final ISourceRepository repository;

    public List<Source> execute() {
        return repository.findActiveSources();
    }
}