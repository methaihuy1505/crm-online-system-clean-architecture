package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Uom;
import com.vti.crm.infrastructure.persistence.entity.UomDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

@Mapper(componentModel = "spring")
public interface UomInfraMapper {

    // 1. Chỉ định cách tạo object Uom từ DbEntity
    @ObjectFactory
    default Uom createUom(UomDbEntity dbEntity) {
        return new Uom(
                dbEntity.getId(),
                dbEntity.getCode(),
                dbEntity.getName(),
                dbEntity.isStatus() //active hay ko
        );
    }

    // 2. Map các trường còn lại (nếu có khác biệt)
    Uom toDomain(UomDbEntity dbEntity);

    UomDbEntity toDbEntity(Uom domain);
}