package com.soeztrip.travelplanner.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatroom_id")
    @JsonIgnore
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    private String content;

    private Date timestamp;

    @Override
    public String toString() {
        return "Message{" +
                "id=" + id +
                ", chatRoom=" + chatRoom +
                ", user=" + user +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}