package com.soeztrip.travelplanner.controller;

import com.soeztrip.travelplanner.dto.*;
import com.soeztrip.travelplanner.model.Place;
import com.soeztrip.travelplanner.model.Trip;
import com.soeztrip.travelplanner.model.UserEntity;
import com.soeztrip.travelplanner.repository.PlaceRepository;
import com.soeztrip.travelplanner.repository.UserRepository;
import com.soeztrip.travelplanner.service.*;
import jakarta.validation.Valid;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.net.MalformedURLException;
import java.util.List;

@Controller
@CrossOrigin(origins = "*")
public class TripController {

    private TripService tripService;
    private UserRepository userRepository;
    private PlaceService placeService;
    private PlaceRepository placeRepository;
    private TicketService ticketService;
    private WeatherService weatherService;
    private FileService fileService;


    public TripController(TripService tripService,
                          UserRepository userRepository,
                          PlaceService placeService,
                          PlaceRepository placeRepository,
                          TicketService ticketService,
                          WeatherService weatherService,
                          FileService fileService) {
        this.tripService = tripService;
        this.userRepository = userRepository;
        this.placeService = placeService;
        this.placeRepository = placeRepository;
        this.ticketService = ticketService;
        this.weatherService = weatherService;
        this.fileService = fileService;
    }

    @GetMapping("/trips")
    public ResponseEntity<List<TripDto>> listTrips() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<TripDto> tripDto = tripService.findAllTrips(authentication.getName());
        return ResponseEntity.ok(tripDto);
    }

    @GetMapping("/trips/{id}")
    public ResponseEntity<?> listTrip(@PathVariable Long id) {
        if (!tripService.tripExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        return ResponseEntity.ok(tripService.findTrip(id));
    }

    @GetMapping("/places/{id}")
    public ResponseEntity<?> getPlace(@PathVariable Long id) {
        if (!placeService.placeExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Place not found");
        }
        return ResponseEntity.ok(placeService.getPlace(id));
    }

    @GetMapping("/trips/{idTrip}/role")
    public ResponseEntity<?> getRole(@PathVariable Long idTrip) {
        if (!tripService.tripExists(idTrip)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        return ResponseEntity.ok().body(this.tripService.getRole(idTrip));
    }

    @GetMapping("/tickets/{id}/download")
    public ResponseEntity<?> downloadFile(@PathVariable Long id) throws FileNotFoundException {
        if (!ticketService.ticketExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }
        try {
            File file = this.ticketService.downloadTicket(id);
            InputStreamResource resource = new InputStreamResource(
                    new FileInputStream(file));
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                    .contentLength(file.length())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to download the file");
        }
    }

    @GetMapping("/place/{id}/tickets")
    public ResponseEntity<?> getTickets(@PathVariable Long id) {
        if (!placeService.placeExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Place not found");
        }
        return ResponseEntity.ok().body(this.placeService.getTickets(id));
    }

    @GetMapping("/trips/{idTrip}/photo")
    public ResponseEntity<?> getTripPhoto(@PathVariable Long idTrip) throws MalformedURLException {
        if (!tripService.tripExists(idTrip)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        Resource resource = this.tripService.getPhotoResource(idTrip);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(resource);
    }

    @GetMapping("/place/{idPlace}/photo")
    public ResponseEntity<?> getPlacePhoto(@PathVariable Long idPlace) throws MalformedURLException {
        if (!placeService.placeExists(idPlace)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Place not found");
        }
        Resource resource = this.placeService.getPhotoResource(idPlace);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(resource);
    }


    @PostMapping("/trips/new")
    public ResponseEntity<?> createTrip(@RequestBody @Valid TripDto tripDto) {
        tripService.saveTrip(tripDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Trip has been successfully created");
    }

    @PostMapping("/trips/places/{id}/new")
    public ResponseEntity<?> addPlace(@PathVariable Long id,
                                      @RequestBody PlaceDto placeDto) {
        try {
            Long placeId = placeService.addNewPlace(id, placeDto);
            placeService.updatePlace(placeId, placeDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("Place has been updated successfully");
    }

    @PutMapping("/trips/{id}")
    public ResponseEntity<?> editTrip(@PathVariable Long id,
                                      @RequestBody TripDto tripDto) {
        if (!tripService.tripExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        try {
            tripDto.setId(id);
            tripService.updateTrip(id, tripDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body("Trip has been updated successfully");
    }

    @PutMapping("/trips/{idTrip}/places/{idPlace}")
    public ResponseEntity<?> editPlace(@PathVariable Long idTrip,
                                       @PathVariable Long idPlace,
                                       @RequestBody PlaceDto dto) {
        if (!tripService.tripExists(idTrip)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        if (!placeService.placeExists(idPlace)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Place not found");
        }
        try {
            placeService.updatePlace(idPlace, dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body("Place has been updated successfully");
    }


    @PostMapping("/trips/{idTrip}/photo")
    public ResponseEntity<?> addTripPhoto(@PathVariable Long idTrip,
                                          @RequestParam(value = "photo", required = false) MultipartFile photo) {
        if (!tripService.tripExists(idTrip)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        try {
            String photoFilePath = tripService.saveTripPhoto(idTrip, photo);
            tripService.updateTripPhoto(idTrip, photoFilePath);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body("Trip photo has been uploaded successfully");
    }

    @PostMapping("/trips/{idTrip}/places/{idPlace}/photo")
    public ResponseEntity<?> addPlacePhoto(@PathVariable Long idTrip,
                                           @PathVariable Long idPlace,
                                           @RequestParam(value = "photo", required = false) MultipartFile photo) {
        if (!tripService.tripExists(idTrip)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        if (!placeService.placeExists(idPlace)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Place not found");
        }
        try {
            String photoFilePath = fileService.savePlaceFile(idTrip, idPlace, photo);
            placeService.updatePlacePhoto(idPlace, photoFilePath);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body("Place photo has been uploaded successfully");
    }

    @PostMapping("/trips/{idTrip}/places/{idPlace}/prompt")
    public ResponseEntity<?> addPrompt(@PathVariable Long idTrip,
                                       @PathVariable Long idPlace,
                                       @RequestBody PlaceDto dto) {
        if (!tripService.tripExists(idTrip)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        if (!placeService.placeExists(idPlace)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Place not found");
        }
        try {
            placeService.addPrompt(idPlace, dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body("Prompt has been updated successfully");
    }

    @PostMapping("/trips/{idTrip}/places/{idPlace}/tickets/new")
    public ResponseEntity<?> addNewTicket(@PathVariable Long idTrip,
                                          @PathVariable Long idPlace,
                                          @ModelAttribute TicketDto dto,
                                          @RequestParam(value = "ticketFile", required = false) MultipartFile ticketFile) {
        if (!tripService.tripExists(idTrip)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        if (!placeService.placeExists(idPlace)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Place not found");
        }
        try {
            if (ticketFile != null && !ticketFile.isEmpty()) {
                String filePath = fileService.savePlaceFile(idTrip, idPlace, ticketFile);
                dto.setTicketPath(filePath);
                ticketService.newTicket(idPlace, dto);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body("Ticket has been successfully added");
    }

    @PutMapping("/trips/{id}/addPerson")
    public ResponseEntity<?> addPerson(@PathVariable Long id, @RequestBody TripParticipantDTO dto) {

        if (!tripService.tripExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        if (!userRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        UserEntity user = this.userRepository.findByEmail(dto.getEmail()).orElseThrow();
        Trip trip = this.tripService.getTrip(id);
        if (this.tripService.getUserTrip(user, trip)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User already assigned to the trip");
        }
        try {
            tripService.addParticipant(id, dto.getEmail());
            return ResponseEntity.ok("User has been added to the trip successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/trips/{id}/removePerson")
    public ResponseEntity<?> removePerson(@PathVariable Long id, @RequestBody TripParticipantDTO dto) {
        if (!tripService.tripExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        if (!userRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        try {
            tripService.removeParticipant(id, dto.getEmail());
            return ResponseEntity.ok("User has been removed from the trip successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/trips/{id}/changeRole")
    public ResponseEntity<?> changeRole(@PathVariable Long id, @RequestBody TripParticipantDTO dto) {
        if (!tripService.tripExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        if (!userRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        if ("OWNER".equalsIgnoreCase(dto.getRole())) {
            return ResponseEntity.badRequest().body("Trip owner can not be changed");
        }
        try {
            tripService.changeRole(id, dto.getEmail(), dto.getRole());
            return ResponseEntity.ok("Participant's role has been changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @DeleteMapping("/trips/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        if (!tripService.tripExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        tripService.deleteTrip(id);
        return ResponseEntity.ok().body("Trip has been deleted");
    }

    @DeleteMapping("/trips/{idTrip}/places/delete/{idPlace}")
    public ResponseEntity<?> deletePlace(@PathVariable Long idTrip, @PathVariable Long idPlace) {
        if (!tripService.tripExists(idTrip)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        if (!placeService.placeExists(idPlace)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Place not found");
        }
        try {
            placeService.deletePlace(idPlace, idTrip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body("Place has been deleted successfully");
    }

    @DeleteMapping("/trips/{idTrip}/places/{idPlace}/tickets/{idTicket}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long idTrip,
                                          @PathVariable Long idPlace,
                                          @PathVariable Long idTicket) {
        if (!tripService.tripExists(idTrip)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }
        if (!placeService.placeExists(idPlace)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Place not found");
        }
        if (!ticketService.ticketExists(idTicket)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }
        try {
            ticketService.deleteTicket(idTrip, idPlace, idTicket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body("Ticket has been deleted successfully");
    }

    @GetMapping("/trips/places/{id}/weather")
    public ResponseEntity<WeatherDTO> getWeatherForPlace(@PathVariable Long id) {
        Place place = placeRepository.findById(id).orElse(null);

        if (place == null) {
            return ResponseEntity.notFound().build();
        }

        String city = place.getName();

        WeatherDTO weatherDTO = weatherService.getWeatherForCity(city);

        if (weatherDTO == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

        return ResponseEntity.ok(weatherDTO);
    }

}