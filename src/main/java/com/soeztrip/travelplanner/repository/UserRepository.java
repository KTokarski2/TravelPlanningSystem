package com.soeztrip.travelplanner.repository;

import com.soeztrip.travelplanner.model.UserEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {

    Boolean existsByEmail(String email);
    Optional<UserEntity>findByEmail(String email);
    @Query("SELECT u.friendList FROM UserEntity u WHERE u.id = :userId")
    List<UserEntity> friendsByUserId(@Param("userId") Long userId);

}
