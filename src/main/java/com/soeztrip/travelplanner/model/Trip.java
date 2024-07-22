package com.soeztrip.travelplanner.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Data
@NoArgsConstructor
@Builder
@Entity
@Table(name = "trips")
@DynamicUpdate
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date startingDate;
    private Date endingDate;
    private String photoFilePath;
    private String title;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<UserTrip> userTrips = new ArrayList<>();

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Place> places = new ArrayList<>();

    @OneToOne(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private ChatRoom chatRoom;

    public Trip(Long id,
                Date startingDate,
                Date endingDate,
                String photoFilePath,
                String title,
                List<UserTrip> userTrips,
                List<Place> places,
                ChatRoom chatRoom) {
        this.id = id;
        this.startingDate = startingDate;
        this.endingDate = endingDate;
        this.photoFilePath = photoFilePath;
        this.title = title;
        this.userTrips = new ArrayList<>();
        this.places = new ArrayList<>();
        this.chatRoom = chatRoom;
    }

    @Override
    public String toString() {
        return "Trip{" +
                "id=" + id +
                ", startingDate=" + startingDate +
                ", endingDate=" + endingDate +
                ", photoFilePath=" + photoFilePath +
                ", title='" + title + '\'' +
                '}';
    }
}
