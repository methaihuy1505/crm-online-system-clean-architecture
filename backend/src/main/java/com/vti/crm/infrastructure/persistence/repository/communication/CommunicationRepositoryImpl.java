package com.vti.crm.infrastructure.persistence.repository.communication;

import com.vti.crm.domain.model.CommunicationDetail;
import com.vti.crm.domain.repository.ICommunicationRepository;
import com.vti.crm.infrastructure.persistence.entity.CommunicationDetailDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.CommunicationInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CommunicationRepositoryImpl implements ICommunicationRepository {


    private final JpaCommunicationDetailRepository jpaRepository;
    private final CommunicationInfraMapper mapper;

    @Override
    public Optional<CommunicationDetail> findPrimary(Integer parentId, String parentType, String commType) {

        // Chuyển String từ Domain sang Enum của Entity DB
        var pTypeEnum = CommunicationDetailDbEntity.ParentType.valueOf(parentType);
        var cTypeEnum = CommunicationDetailDbEntity.CommType.valueOf(commType);

        // 👉 ĐÂY RỒI! Nó gọi đúng hàm find cũ của bạn, IDE sẽ hết báo "no usage"
        return jpaRepository.findByParentIdAndParentTypeAndCommTypeAndIsPrimaryTrue(
                parentId, pTypeEnum, cTypeEnum
        ).map(mapper::toDomain);
    }

    @Override
    public void save(CommunicationDetail detail) {
        CommunicationDetailDbEntity entity = mapper.toEntity(detail);
        jpaRepository.save(entity);
    }
}