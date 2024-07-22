package com.soeztrip.travelplanner.repository;

import com.soeztrip.travelplanner.model.TripRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TripRoleRepository extends JpaRepository<TripRole, Long> {
    Optional<TripRole> findByName(String name);
}
