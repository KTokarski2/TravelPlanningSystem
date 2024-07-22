package com.soeztrip.travelplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageHistoryDto {
    private Long messageId;
    private String content;
    private Date timeStamp;
    private Long chatRoomId;
    private Long userId;
    private String sender;
}
