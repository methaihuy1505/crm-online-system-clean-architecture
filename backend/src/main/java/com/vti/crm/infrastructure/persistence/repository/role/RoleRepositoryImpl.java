package com.vti.crm.infrastructure.persistence.repository.role;

import com.vti.crm.domain.model.Role;
import com.vti.crm.domain.repository.IRoleRepository;
import com.vti.crm.infrastructure.persistence.mapper.RoleInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class RoleRepositoryImpl implements IRoleRepository {
    private final JpaRoleRepository jpaRepository;
    private final RoleInfraMapper mapper;

    @Override public List<Role> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }
    @Override public Optional<Role> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }
    @Override public Role save(Role role) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(role)));
    }
    @Override public void deleteById(Integer id) { jpaRepository.deleteById(id); }
}