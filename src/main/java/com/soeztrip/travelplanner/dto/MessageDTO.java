package com.soeztrip.travelplanner.dto;


import lombok.Data;

@Data
public class MessageDTO {
    private Long id;
    private String content;
    private Long senderId;
    private Long chatRoomId;
}