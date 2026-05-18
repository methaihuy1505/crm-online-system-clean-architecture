package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.repository.IUserRepository;
import com.vti.crm.infrastructure.persistence.mapper.UserInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements IUserRepository {
    private final JpaUserRepository jpaRepository;
    private final UserInfraMapper mapper;
    @Override
    public void save(User user) {
        jpaRepository.save(mapper.toDbEntity(user));
    }

    @Override
    public Optional<User> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomainEntity);
    }

    @Override
    public List<User> findAll() {
        return jpaRepository.findAll()
                .stream()
                .map(mapper::toDomainEntity)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
