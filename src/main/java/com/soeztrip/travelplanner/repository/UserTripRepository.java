package com.soeztrip.travelplanner.repository;

import com.soeztrip.travelplanner.model.Trip;
import com.soeztrip.travelplanner.model.UserEntity;
import com.soeztrip.travelplanner.model.UserTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserTripRepository extends JpaRepository<UserTrip, Long> {

    UserTrip findByUserAndTrip(UserEntity user, Trip trip);

    @Query("SELECT ut.user FROM UserTrip ut " +
            "WHERE ut.trip.id = :tripId AND ut.tripRole.id = 1")
    Optional<UserEntity> findOwner(@Param("tripId") Long tripId);

    @Query("SELECT ut.tripRole.name FROM UserTrip ut " +
            "WHERE ut.trip.id = :tripId AND ut.user.email = :email")
    Optional<String> findRole(@Param("tripId") Long tripId, @Param("email") String email);
}


