package com.soeztrip.travelplanner.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_trip")
public class UserTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity user;


    @ManyToOne
    @JoinColumn(name = "trip_id", referencedColumnName = "id")
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "trip_role_id", referencedColumnName = "id")
    private TripRole tripRole;

    public void setTrip(Trip trip) {
        this.trip = trip;
        trip.getUserTrips().add(this);
    }

    public void setUser(UserEntity user) {
        this.user = user;
        user.getUserTrips().add(this);
    }
}
