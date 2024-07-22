package com.soeztrip.travelplanner.controller;

import com.soeztrip.travelplanner.dto.UserDto;
import com.soeztrip.travelplanner.service.UserService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.net.URI;


@Controller
@CrossOrigin(origins = "*")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<?> listUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> listUser(@PathVariable Long id) {
        if (!userService.userExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(userService.findUser(id));
    }

    @GetMapping("/users/get")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userService.getUserByEmail(authentication.getName()));
    }

    @GetMapping("/users/{id}/stats")
    public ResponseEntity<?>getProfileStats(@PathVariable Long id){
        if(!userService.userExists(id)){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(userService.getStats(id));
    }

    @GetMapping("/user/friends")
    public ResponseEntity<?> getFriends() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userService.getFriends(authentication.getName()));
    }

    @GetMapping("/users/{id}/profilePicture")
    public ResponseEntity<?> getProfilePicture(@PathVariable Long id) throws MalformedURLException {
        if(!userService.userExists(id)){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        Resource resource = this.userService.getPictureResource(id);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(resource);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> editUser(@PathVariable Long id,
                                      @Valid @RequestBody UserDto userDto,
                                      BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("data has errors");
        }
        if (!userService.userExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        userDto.setId(id);
        userService.updateUser(userDto);
        return ResponseEntity.created(URI.create("/" + userDto.getId())).body(userDto);
    }

    @PutMapping("/users/{id}/uploadPP")
    public ResponseEntity<?> uploadPhoto(@PathVariable Long id,
                                         @RequestParam(value = "profilePicture",
                                                 required = true) MultipartFile pictureFile) {
        if (!userService.userExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        try {
            String filePath = userService.saveProfilePicture(id,pictureFile);
            userService.updateProfilePicture(id, filePath);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().body("Profile picture has been uploaded successfully");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userService.userExists(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("users/add-friend/{friendId}")
    public ResponseEntity<?> addFriend(@PathVariable Long friendId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userService.addFriend(authentication.getName(), friendId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("users/remove-friend/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable Long friendId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userService.removeFriend(authentication.getName(), friendId);
        return ResponseEntity.ok().build();
    }
}
