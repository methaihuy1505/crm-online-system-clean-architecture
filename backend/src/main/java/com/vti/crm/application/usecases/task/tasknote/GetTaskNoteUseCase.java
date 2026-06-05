package com.vti.crm.application.usecases.task.tasknote;

import com.vti.crm.application.usecases.user.GetUserByIdUseCase; // 🌟 IMPORT USECASE USER
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.TaskNote;
import com.vti.crm.domain.repository.ITaskNoteRepository;
import com.vti.crm.interfaces.dto.response.task.TaskNoteReponseDTO;
import com.vti.crm.interfaces.mapper.TaskNoteWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetTaskNoteUseCase {
    private final ITaskNoteRepository iTaskNoteRepository;
    private final TaskNoteWebMapper mapper; // Tiêm Mapper
    private final GetUserByIdUseCase getUserByIdUseCase; // Tiêm UseCase lấy User

    public PagedResult<TaskNoteReponseDTO> excuteGetAll(int page, int size) {
        PagedResult<TaskNote> pagedResult = iTaskNoteRepository.findAll(page,size);
        PagedResult<TaskNoteReponseDTO> responseList = mapper.toResponseList(pagedResult);

        if (responseList.getData() != null) {
            responseList.getData().forEach(this::enrichTaskNote);
        }
        return responseList;
    }

    public TaskNoteReponseDTO excuteGetById(Integer id) {
        TaskNote taskNote = iTaskNoteRepository.findById(id).
                orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Activity với ID: " + id));

        TaskNoteReponseDTO response = mapper.toResponse(taskNote);
        enrichTaskNote(response);
        return response;
    }

    public PagedResult<TaskNoteReponseDTO> executeGetByTaskId(Integer taskId, int page, int size) {
        PagedResult<TaskNote> pagedResult = iTaskNoteRepository.findByTaskId(taskId, page, size);
        PagedResult<TaskNoteReponseDTO> responseList = mapper.toResponseList(pagedResult);

        if (responseList.getData() != null) {
            responseList.getData().forEach(this::enrichTaskNote);
        }
        return responseList;
    }

    // 🌟 HÀM BỒI ĐẮP TÊN NGƯỜI TẠO VÀO DTO
    private void enrichTaskNote(TaskNoteReponseDTO response) {
        if (response.getUserId() != null) {
            try {
                String userName = getUserByIdUseCase.execute(response.getUserId()).getFullName();
                response.setCreatedByName(userName);
            } catch (Exception e) {
                response.setCreatedByName("Người dùng #" + response.getUserId() + " (Lỗi tải)");
            }
        } else {
            response.setCreatedByName("Hệ thống tự động");
        }
    }
}