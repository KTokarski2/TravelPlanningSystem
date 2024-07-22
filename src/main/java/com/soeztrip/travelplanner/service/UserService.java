package com.soeztrip.travelplanner.service;


import com.soeztrip.travelplanner.dto.ProfileStatsDto;
import com.soeztrip.travelplanner.dto.UserDataDto;
import com.soeztrip.travelplanner.dto.UserDto;
import com.soeztrip.travelplanner.model.Trip;
import com.soeztrip.travelplanner.model.UserEntity;
import com.soeztrip.travelplanner.model.UserTrip;
import com.soeztrip.travelplanner.repository.RoleRepository;
import com.soeztrip.travelplanner.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserService {

    private UserRepository userRepository;
    private FileService fileService;
    private RoleRepository roleRepository;

    public UserService(UserRepository userRepository,
                       FileService fileService,
                       RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.fileService = fileService;
        this.roleRepository = roleRepository;
    }

    public boolean userExists(Long id) {
        return userRepository.existsById(id);
    }

    public List<UserDto> findAllUsers() {
        List<UserEntity> userEntities = userRepository.findAll();
        return userEntities.stream().map(this::mapUserToDto).collect(Collectors.toList());
    }

    public ProfileStatsDto getStats(Long id) {
        UserEntity user = this.userRepository.findById(id).orElseThrow();
        ProfileStatsDto profileStatsDto = new ProfileStatsDto();
        profileStatsDto.setTrips(user.getUserTrips().size());
        List<UserTrip> userTrips = user.getUserTrips();
        List<Trip> trips = userTrips.stream()
                .map(UserTrip::getTrip)
                .collect(Collectors.toList());

        int placeCount = trips.stream().flatMap(trip -> trip.getPlaces().stream()).mapToInt(place -> 1).sum();
        profileStatsDto.setPlaces(placeCount);
        profileStatsDto.setFriends(user.getFriendList().size());
        return profileStatsDto;
    }

    public List<UserDto> getFriends(String email) {
        Long userId = Objects.requireNonNull(userRepository.findByEmail(email).orElse(null)).getId();
        List<UserEntity> friendsEntities = userRepository.friendsByUserId(userId);
        return friendsEntities.stream()
                .map(this::mapUserToDto)
                .collect(Collectors.toList());
    }

    public UserDataDto findUser(Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("No user"));
        return mapUserToUserNameDto(user);
    }

    public UserDataDto getUserByEmail(String email) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("email not found"));
        return mapUserToUserNameDto(user);
    }

    private UserDataDto mapUserToUserNameDto(UserEntity userEntity) {
        return UserDataDto.builder()
                .firstName(userEntity.getFirstName())
                .email(userEntity.getEmail())
                .id(userEntity.getId())
                .lastName(userEntity.getLastName()).build();
    }

    private UserDto mapUserToDto(UserEntity userEntity) {
        UserDto userDto = UserDto.builder()
                .id(userEntity.getId())
                .firstName(userEntity.getFirstName())
                .lastName(userEntity.getLastName())
                .email(userEntity.getEmail())
                .password(userEntity.getPassword()).build();
        return userDto;

    }

    public void updateUser(UserDto userDto) {
        UserEntity existingUser = userRepository.findById(userDto.getId()).orElse(null);
        if (existingUser == null) {
            throw new EntityNotFoundException("The user with the specified ID does not exist.");
        }
        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setLastName(userDto.getLastName());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setPassword(userDto.getPassword());

        userRepository.save(existingUser);
    }

    public String saveProfilePicture(Long userId, MultipartFile photoFile) {
        try {
            String fileName = photoFile.getOriginalFilename();
            String projectRootDirectory = System.getProperty("user.dir");
            Path directoryPath = Paths.get(projectRootDirectory, "UserData", userId.toString());
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

    public void updateProfilePicture(Long id, String filePath) {
        UserEntity user = this.userRepository.findById(id).orElseThrow(
                () -> new UsernameNotFoundException("User not found"));
        fileService.removeFile(user.getProfilePicturePath());
        user.setProfilePicturePath(filePath);
        this.userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public void addFriend(String userEmail, Long friendId) {

        UserEntity user = userRepository.findByEmail(userEmail).orElseThrow(()
                -> new IllegalArgumentException("User not found"));
        UserEntity friend = userRepository.findById(friendId).orElseThrow(()
                -> new IllegalArgumentException("Friend not found"));

        if (!user.getFriendList().contains(friend)) {
            user.getFriendList().add(friend);
            friend.getFriendList().add(user);

            userRepository.save(user);
            userRepository.save(friend);
        }
    }

    @Transactional
    public void removeFriend(String userEmail, Long friendId) {

        UserEntity user = userRepository.findByEmail(userEmail).orElseThrow(()
                -> new IllegalArgumentException("User not found"));
        UserEntity friend = userRepository.findById(friendId).orElseThrow(()
                -> new IllegalArgumentException("Friend not found"));

        user.getFriendList().remove(friend);
        friend.getFriendList().remove(user);

        userRepository.save(user);
        userRepository.save(friend);
    }

    public Resource getPictureResource(Long id) throws MalformedURLException {
        UserEntity user = this.userRepository.findById(id).orElseThrow();
        Path path = Paths.get(user.getProfilePicturePath());
        return new UrlResource(path.toUri());
    }
}
