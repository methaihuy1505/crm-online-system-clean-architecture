package com.vti.crm.application.usecases.uom;

import com.vti.crm.domain.model.Uom;
import com.vti.crm.domain.repository.IUomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateUomUseCase {
    private final IUomRepository uomRepository;

    @Transactional
    public Uom execute(Integer id, String code, String name, boolean status) {
        // Bước 1: Nhờ Thủ kho kéo dữ liệu lên
        Uom uom = uomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy UOM với id: " + id));

        // Bước 2: Gọi hàm của Rich Entity để nó tự thay đổi trạng thái
        uom.update(code, name, status);

        // Bước 3: Nhờ Thủ kho lưu lại
        return uomRepository.save(uom);
    }
}