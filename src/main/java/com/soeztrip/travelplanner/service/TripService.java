package com.soeztrip.travelplanner.service;


import com.soeztrip.travelplanner.dto.PlaceDto;
import com.soeztrip.travelplanner.dto.TicketDto;
import com.soeztrip.travelplanner.dto.TripDto;
import com.soeztrip.travelplanner.dto.UserDto;
import com.soeztrip.travelplanner.model.*;
import com.soeztrip.travelplanner.repository.ChatRoomRepository;
import com.soeztrip.travelplanner.repository.TripRepository;
import com.soeztrip.travelplanner.repository.UserRepository;
import com.soeztrip.travelplanner.repository.UserTripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    private TripRepository tripRepository;
    private UserRepository userRepository;
    private UserTripRepository userTripRepository;
    private TripRoleService tripRoleService;
    private FileService fileService;
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    public TripService(TripRepository tripRepository,
                       UserRepository userRepository,
                       UserTripRepository userTripRepository,
                       TripRoleService tripRoleService,
                       FileService fileService,
                       ChatRoomRepository chatRoomRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.userTripRepository = userTripRepository;
        this.tripRoleService = tripRoleService;
        this.fileService = fileService;
        this.chatRoomRepository = chatRoomRepository;
    }

    public TripService() {

    }

    public String getRole(Long tripId){
        return this.tripRoleService.checkUserRole(tripId);
    }

    public void deleteTrip(Long id) {
        String requesterRole = tripRoleService.checkUserRole(id);
        if (!"OWNER".equals(requesterRole)) {
            throw new RuntimeException("Only the trip owner can delete trip");
        }
        Trip trip = this.tripRepository.findById(id).orElseThrow();
        List<Place> placesList = trip.getPlaces();
        if (placesList != null && !placesList.isEmpty()) {
            placesList.forEach(place -> {
                List<Ticket> ticketList = place.getTickets();
                fileService.removeFiles(ticketList);
            });
        }
        tripRepository.deleteById(id);

    }
    public Trip getTrip(Long id){
        return this.tripRepository.findById(id).orElseThrow();
    }

    public TripDto findTrip(Long id) {
        Trip trip = tripRepository.findById(id).get();
        return mapToTripDto(trip);
    }

    public List<TripDto> findAllTrips(String email) {
        List<Trip> trips = tripRepository.findByUserEmail(email);
        return trips.stream().map(this::mapToTripDto).collect(Collectors.toList());
    }

    public Trip mapToTrip(TripDto tripDto) {
        Trip trip = new Trip();
        trip.setId(tripDto.getId());
        trip.setStartingDate(tripDto.getStartingDate());
        trip.setEndingDate(tripDto.getEndingDate());
        trip.setTitle(tripDto.getTitle());
        List<Place> places = (tripDto.getPlaces() != null) ?
                tripDto.getPlaces().stream().map(this::mapToPlace).collect(Collectors.toList()) :
                new ArrayList<>();
        trip.setPlaces(places);
        return trip;
    }

    public Place mapToPlace(PlaceDto placeDto) {
        Place place = new Place();
        place.setId(placeDto.getId());
        place.setName(placeDto.getName());
        place.setArrive(placeDto.getArrive());
        place.setLeave(placeDto.getLeave());
        place.setPrompt(placeDto.getPrompt());
        place.setCountry(placeDto.getCountry());

        List<Ticket> tickets = (placeDto.getTickets() != null) ?
                placeDto.getTickets().stream().map(this::mapToTicket).collect(Collectors.toList()) :
                new ArrayList<>();
        place.setTickets(tickets);
        return place;
    }

    public Ticket mapToTicket(TicketDto ticketDto) {
        Ticket ticket = new Ticket();
        ticket.setId(ticketDto.getId());
        ticket.setName(ticketDto.getName());
        return ticket;
    }

    public TripDto mapToTripDto(Trip trip) {
        TripDto tripDto = new TripDto();
        tripDto.setId(trip.getId());
        tripDto.setStartingDate(trip.getStartingDate());
        tripDto.setEndingDate(trip.getEndingDate());
        tripDto.setTitle(trip.getTitle());
        List<PlaceDto> placeDtos = trip.getPlaces().stream().map(this::mapToPlaceDto).collect(Collectors.toList());

        tripDto.setPlaces(placeDtos);
        tripDto.setParticipants(mapToUserDtoList(trip.getUserTrips()));
        tripDto.setChatRoomId(trip.getChatRoom().getId());

        return tripDto;
    }

    public PlaceDto mapToPlaceDto(Place place) {
        PlaceDto placeDto = new PlaceDto();
        placeDto.setId(place.getId());
        placeDto.setName(place.getName());
        placeDto.setArrive(place.getArrive());
        placeDto.setLeave(place.getLeave());
        placeDto.setPrompt(place.getPrompt());
        placeDto.setCountry(place.getCountry());

        List<TicketDto> ticketDtos = place.getTickets().stream().map(this::mapToTicketDto).collect(Collectors.toList());
        placeDto.setTickets(ticketDtos);

        return placeDto;
    }

    public TicketDto mapToTicketDto(Ticket ticket) {
        TicketDto ticketDto = new TicketDto();
        ticketDto.setId(ticket.getId());
        ticketDto.setName(ticket.getName());
        ticketDto.setTicketPath(ticket.getTicketPath());
        return ticketDto;
    }

    private List<UserDto> mapToUserDtoList(List<UserTrip> userTrips) {
        return userTrips.stream()
                .map(userTrip -> UserDto.builder()
                        .id(userTrip.getUser().getId())
                        .firstName(userTrip.getUser().getFirstName())
                        .lastName(userTrip.getUser().getLastName())
                        .email(userTrip.getUser().getEmail())
                        .role(userTrip.getTripRole().getName())
                        .build())
                .collect(Collectors.toList());
    }

    public void saveTrip(TripDto tripDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = this.userRepository.findByEmail(email).orElseThrow();
        Trip trip = mapToTrip(tripDto);
        UserTrip userTrip = new UserTrip();
        userTrip.setUser(user);
        userTrip.setTrip(trip);
        TripRole role = tripRoleService.getRoleByName("OWNER");
        userTrip.setTripRole(role);
        tripRepository.save(trip);
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setTrip(trip);
        List<UserEntity>userList=new ArrayList<>();
        userList.add(user);
        chatRoom.setUsers(userList);
        chatRoomRepository.save(chatRoom);
        userTripRepository.save(userTrip);
    }

    public boolean tripExists(Long id) {
        return tripRepository.existsById(id);
    }

    public boolean getUserTrip(UserEntity user, Trip trip){
        UserTrip userTrip = userTripRepository.findByUserAndTrip(user, trip);
        return userTrip !=null;
    }

    public void updateTrip(Long id, TripDto tripDto) {
        String requesterRole = tripRoleService.checkUserRole(id);
        if (!"OWNER".equals(requesterRole) && !"MANAGER".equals(requesterRole)) {
            throw new RuntimeException("Only the trip owner or manager can modify trip properties");
        }

        Trip trip = this.tripRepository.findById(id).orElseThrow();
        if (tripDto.getStartingDate() != null) {
            trip.setStartingDate(tripDto.getStartingDate());
        }
        if (tripDto.getEndingDate() != null) {
            trip.setEndingDate(tripDto.getEndingDate());
        }
        if (tripDto.getTitle() != null) {
            trip.setTitle(tripDto.getTitle());
        }

        tripRepository.save(trip);
    }

    public void addParticipant(Long id, String email) {
        String requesterRole = tripRoleService.checkUserRole(id);
        if (!"OWNER".equals(requesterRole) && !"MANAGER".equals(requesterRole)) {
            throw new RuntimeException("Only the trip owner or manager can add participants");
        }
        UserEntity user = this.userRepository.findByEmail(email).orElseThrow();
        Trip trip = this.tripRepository.findById(id).orElseThrow();
        UserTrip userTrip = new UserTrip();
        userTrip.setUser(user);
        userTrip.setTrip(trip);
        TripRole role = tripRoleService.getRoleByName("PARTICIPANT");
        userTrip.setTripRole(role);
        ChatRoom chatRoom = chatRoomRepository.findByTripId(id);
        chatRoom.getUsers().add(user);
        chatRoomRepository.save(chatRoom);
        userTripRepository.save(userTrip);
    }

    public void removeParticipant(Long id, String email) {
        String requesterRole = tripRoleService.checkUserRole(id);
        if (!"OWNER".equals(requesterRole) && !"MANAGER".equals(requesterRole)) {
            throw new RuntimeException("Only the trip owner or manager can remove participants");
        }
        UserEntity tripOwner = userTripRepository.findOwner(id).orElseThrow();
        if (tripOwner.getEmail().equals(email)) {
            throw new RuntimeException("Owner can not be removed from the trip");
        }
        UserEntity user = this.userRepository.findByEmail(email).orElseThrow();
        Trip trip = this.tripRepository.findById(id).orElseThrow();
        UserTrip userTrip = userTripRepository.findByUserAndTrip(user, trip);
        userTripRepository.delete(userTrip);
        tripRepository.save(trip);
    }

    public void changeRole(Long id, String email, String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String requesterEmail = authentication.getName();
        UserEntity tripOwner = userTripRepository.findOwner(id).orElseThrow();
        if (!tripOwner.getEmail().equals(requesterEmail)) {
            throw new RuntimeException("Only trip owner can change roles");
        }
        UserEntity user = this.userRepository.findByEmail(email).orElseThrow();
        Trip trip = this.tripRepository.findById(id).orElseThrow();
        UserTrip userTrip = userTripRepository.findByUserAndTrip(user, trip);

        TripRole tripRole = tripRoleService.getRoleByName(role);
        userTrip.setTripRole(tripRole);
        userTripRepository.save(userTrip);
    }

    public String saveTripPhoto(Long idTrip, MultipartFile photoFile) {
        try {
            String fileName = photoFile.getOriginalFilename();
            String projectRootDirectory = System.getProperty("user.dir");
            Path directoryPath = Paths.get(projectRootDirectory, "TripData", idTrip.toString());
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }
            assert fileName != null;
            Path filePath = directoryPath.resolve(fileName);
            Files.copy(photoFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filePath.toString();

        } catch (IOException e) {
            throw new RuntimeException("Failed to save the photo", e);
        }
    }

    public void updateTripPhoto(Long idTrip, String photoFilePath) {
        Trip trip = this.tripRepository.findById(idTrip).orElseThrow();
        trip.setPhotoFilePath(photoFilePath);
        this.tripRepository.save(trip);
    }


    public Resource getPhotoResource(Long idTrip) throws MalformedURLException {
        Trip trip = this.tripRepository.findById(idTrip).orElseThrow();
        Path path = Paths.get(trip.getPhotoFilePath());
        return new UrlResource(path.toUri());
    }
}