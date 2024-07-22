package com.soeztrip.travelplanner.controller;

import com.soeztrip.travelplanner.dto.ChatMessage;
import com.soeztrip.travelplanner.dto.MessageHistoryDto;
import com.soeztrip.travelplanner.exception.ChatRoomNotFoundException;
import com.soeztrip.travelplanner.exception.UserNotFoundException;
import com.soeztrip.travelplanner.model.Message;
import com.soeztrip.travelplanner.repository.ChatRoomRepository;
import com.soeztrip.travelplanner.repository.MessageRepository;
import com.soeztrip.travelplanner.repository.UserRepository;
import com.soeztrip.travelplanner.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@CrossOrigin(origins = "*")
public class ChatRoomController {

    private SimpMessagingTemplate messagingTemplate;
    private MessageRepository messageRepository;
    private ChatRoomRepository chatRoomRepository;
    private UserRepository userRepository;
    private MessageService messageService;

    public ChatRoomController(SimpMessagingTemplate messagingTemplate,
                              MessageRepository messageRepository,
                              ChatRoomRepository chatRoomRepository,
                              UserRepository userRepository,
                              MessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
        this.messageService = messageService;
    }

    @MessageMapping("/chat.sendMessage/{chatRoomId}")
    public void sendMessage(ChatMessage chatMessage, @DestinationVariable Long chatRoomId) {

        Message message = new Message();
        message.setChatRoom(chatRoomRepository.findById(chatRoomId).orElseThrow(()
                -> new ChatRoomNotFoundException("ChatRoom not found")));
        message.setUser(userRepository.findById(chatMessage.getUserId()).orElseThrow(()
                -> new UserNotFoundException("User not found")));
        message.setContent(chatMessage.getContent());
        message.setTimestamp(new Timestamp(System.currentTimeMillis()));
        Message savedMessage = messageRepository.save(message);
        chatMessage.setMessageId(savedMessage.getId());
        chatMessage.setTimeStamp(savedMessage.getTimestamp());
        messagingTemplate.convertAndSend("/topic/chatroom/" + chatRoomId, chatMessage);

    }

    @MessageMapping("/chat.addUser/{chatRoomId}")
    public void addUser(ChatMessage chatMessage, @DestinationVariable Long chatRoomId) {
        chatMessage.setContent(chatMessage.getSender() + " joined");
        messagingTemplate.convertAndSend("/topic/chatroom/" + chatRoomId, chatMessage);
    }

    @GetMapping("/chat/{chatRoomId}/history")
    public ResponseEntity<?> getHistory(@PathVariable Long chatRoomId){
        List<Message>messageList=this.messageRepository.findByChatRoomId(chatRoomId);
        List<MessageHistoryDto>messageHistoryDtoList=messageList.stream()
                .map(MessageService::MessageMapper)
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(messageHistoryDtoList);
    }
}