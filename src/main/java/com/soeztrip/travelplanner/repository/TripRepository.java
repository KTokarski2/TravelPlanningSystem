package com.soeztrip.travelplanner.repository;

import com.soeztrip.travelplanner.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip,Long> {
    @Query("SELECT DISTINCT t FROM Trip t JOIN t.userTrips ut JOIN ut.user u WHERE u.email = :email")
    List<Trip> findByUserEmail(String email);
}
