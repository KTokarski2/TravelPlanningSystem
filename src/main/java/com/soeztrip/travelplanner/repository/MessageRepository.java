package com.soeztrip.travelplanner.repository;


import com.soeztrip.travelplanner.model.Message;
import com.soeztrip.travelplanner.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    //List<Message> findAllBySender(UserEntity sender);

    //List<Message> findBySender(UserEntity sender);

    List<Message> findByChatRoomId(Long chatRoomId);
}