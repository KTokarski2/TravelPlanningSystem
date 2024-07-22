package com.soeztrip.travelplanner.service;

import com.soeztrip.travelplanner.model.TripRole;
import com.soeztrip.travelplanner.repository.TripRoleRepository;
import com.soeztrip.travelplanner.repository.UserTripRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class TripRoleService {

    private TripRoleRepository tripRoleRepository;
    private UserTripRepository userTripRepository;

    public TripRoleService(TripRoleRepository tripRoleRepository,
                           UserTripRepository userTripRepository) {
        this.tripRoleRepository = tripRoleRepository;
        this.userTripRepository = userTripRepository;
    }

    public TripRole getRoleByName(String name) {
        return tripRoleRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Role not found: " + name));
    }

    protected String checkUserRole(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String requesterEmail = authentication.getName();
        return userTripRepository.findRole(id, requesterEmail).orElseThrow(() -> new IllegalArgumentException(
                "Role not found for user with email: " + requesterEmail));
    }
}
