package com.vti.crm.application.usecases.team;

import com.vti.crm.domain.repository.ITeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteTeamUseCase {
    private final ITeamRepository teamRepository;

    public void execute(Integer id) {
        if (teamRepository.findById(id).isEmpty()) {
            throw new RuntimeException("Không tìm thấy nhóm để xóa");
        }
        teamRepository.deleteById(id);
    }
}