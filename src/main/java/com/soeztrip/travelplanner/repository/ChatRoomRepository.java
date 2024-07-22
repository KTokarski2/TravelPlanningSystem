package com.soeztrip.travelplanner.repository;

import com.soeztrip.travelplanner.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    //List<ChatRoom> findByUserEntitiesId(Long userId);

    ChatRoom findByTripId(Long tripId);
}