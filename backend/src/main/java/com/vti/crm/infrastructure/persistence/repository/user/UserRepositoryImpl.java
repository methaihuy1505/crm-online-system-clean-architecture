package com.vti.crm.infrastructure.persistence.repository.user;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.model.UserFilter;
import com.vti.crm.domain.repository.IUserRepository;
import com.vti.crm.infrastructure.persistence.entity.UserDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.UserInfraMapper;
import com.vti.crm.infrastructure.persistence.specification.UserSpecification;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements IUserRepository {
    private final JpaUserRepository jpaRepository;
    private final UserInfraMapper mapper;

    @Override
    public User save(User user) {
        UserDbEntity dbEntity = mapper.toDbEntity(user);
        UserDbEntity saved = jpaRepository.save(dbEntity);
        return mapper.toDomainEntity(saved);
    }

    @Override
    public Optional<User> findById(Integer id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomainEntity);
    }


    @Override
    public Page<User> findAll(Pageable pageable) {
        return jpaRepository.findAll(pageable)
                .map(mapper::toDomainEntity);
    }

    @Override
    public Page<User> findAll(Pageable pageable, UserFilter filter) {
        // Thay vì filter request, nay ta dùng UserFilter của Domain
        return jpaRepository.findAll(UserSpecification.withFilter(filter), pageable)
                .map(mapper::toDomainEntity);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return jpaRepository.findByUsername(username)
                .map(mapper::toDomainEntity);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email)
                .map(mapper::toDomainEntity);
    }

    @Override
    public boolean existsByUsername(String username) {
        return jpaRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    @Override
    public void delete(User user) {
        jpaRepository.deleteById(user.getId());
    }

    @Override
    public boolean existsByRoleId(Integer roleId) {
        return jpaRepository.existsByRoleId(roleId);
    }
}
