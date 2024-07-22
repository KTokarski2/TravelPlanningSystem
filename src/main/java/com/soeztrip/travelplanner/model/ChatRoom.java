package com.soeztrip.travelplanner.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Builder
@Entity
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToMany
    @JoinTable(
            name = "chatroom_user",
            joinColumns = @JoinColumn(name = "chatroom_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<UserEntity> users;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Message> messages;

    public ChatRoom(Long id, Trip trip, List<UserEntity> users, List<Message> messages) {
        this.id = id;
        this.trip = trip;
        this.users = new ArrayList<>();
        this.messages = new ArrayList<>();
    }

    @Override
    public String toString() {
        return "ChatRoom{" +
                "id=" + id +
                ", trip=" + trip +
                ", users=" + users +
                ", messages=" + messages +
                '}';
    }
}