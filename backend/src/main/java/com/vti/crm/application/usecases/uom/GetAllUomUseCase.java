package com.vti.crm.application.usecases.uom;

import com.vti.crm.domain.model.Uom;
import com.vti.crm.domain.repository.IUomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllUomUseCase {
    private final IUomRepository uomRepository;

    public List<Uom> execute() {
        return uomRepository.findAll();
    }
}