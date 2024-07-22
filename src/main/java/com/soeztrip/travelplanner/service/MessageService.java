package com.soeztrip.travelplanner.service;

import com.soeztrip.travelplanner.dto.MessageHistoryDto;
import com.soeztrip.travelplanner.model.Message;
import org.springframework.stereotype.Service;


@Service
public class MessageService {

    public static MessageHistoryDto MessageMapper(Message message) {
        MessageHistoryDto messageHistoryDto = new MessageHistoryDto();
        messageHistoryDto.setMessageId(message.getId());
        messageHistoryDto.setContent(message.getContent());
        messageHistoryDto.setTimeStamp(message.getTimestamp());
        messageHistoryDto.setChatRoomId(message.getId());
        messageHistoryDto.setUserId(message.getUser().getId());
        messageHistoryDto.setSender(message.getUser().getFirstName()+" "+message.getUser().getLastName());

        return messageHistoryDto;
    }
}
