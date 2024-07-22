package com.soeztrip.travelplanner.service;

import com.soeztrip.travelplanner.dto.TicketDto;
import com.soeztrip.travelplanner.model.Place;
import com.soeztrip.travelplanner.model.Ticket;
import com.soeztrip.travelplanner.repository.PlaceRepository;
import com.soeztrip.travelplanner.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class TicketService {

    private TicketRepository ticketRepository;
    private PlaceRepository placeRepository;
    private TripRoleService tripRoleService;
    private FileService fileService;

    public TicketService(TicketRepository ticketRepository,
                         PlaceRepository placeRepository,
                         TripRoleService tripRoleService,
                         FileService fileService) {
        this.ticketRepository = ticketRepository;
        this.placeRepository = placeRepository;
        this.tripRoleService = tripRoleService;
        this.fileService = fileService;
    }

    public void newTicket(Long placeId, TicketDto dto) {
        Ticket ticket = new Ticket();
        Place place = this.placeRepository.findById(placeId).orElseThrow();
        ticket.setName(dto.getName());
        ticket.setTicketPath(dto.getTicketPath());
        ticket.setPlace(place);
        ticketRepository.save(ticket);
        place.getTickets().add(ticket);
        placeRepository.save(place);
    }

    public void deleteTicket(Long tripId, Long placeId, Long ticketId) {
        String requesterRole = tripRoleService.checkUserRole(tripId);
        if (!"OWNER".equals(requesterRole) && !"MANAGER".equals(requesterRole)) {
            throw new RuntimeException("Only the trip owner or manager can delete places");
        }
        Ticket ticket = this.ticketRepository.findById(ticketId).orElseThrow();
        fileService.removeFile(ticket.getTicketPath());
        ticketRepository.deleteById(ticketId);

    }



    public boolean ticketExists(Long id) {
        return ticketRepository.existsById(id);
    }

    public File downloadTicket(Long id) {
        Ticket ticket = this.ticketRepository.findById(id).orElseThrow();
        return new File(ticket.getTicketPath());
    }
}
