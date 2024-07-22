package com.soeztrip.travelplanner.service;

import com.soeztrip.travelplanner.model.Ticket;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class FileService {

    protected void removeFile(String filePath) {
        if (filePath != null && !filePath.isEmpty()) {
            Path path = Paths.get(filePath);
            try {
                if (Files.exists(path)) {
                    Files.delete(path);
                    System.out.println("File deleted successfully: " + filePath);
                } else {
                    System.out.println("File not found: " + filePath);
                }
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to delete the file", e);
            }
        }
    }

    protected void removeFiles(List<Ticket> ticketList) {
        if (ticketList != null && !ticketList.isEmpty()) {
            for (Ticket ticket : ticketList) {
                String ticketPath = ticket.getTicketPath();
                if (ticketPath != null && !ticketPath.isEmpty()) {
                    this.removeFile(ticketPath);
                }
            }
        }
    }
    public String savePlaceFile(Long tripId, Long placeId, MultipartFile ticketFile) {
        try {
            String fileName = ticketFile.getOriginalFilename();
            String projectRootDirectory = System.getProperty("user.dir");
            Path directoryPath = Paths.get(projectRootDirectory, "TripData", tripId.toString(), placeId.toString());
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }
            Path filePath = directoryPath.resolve(fileName);
            Files.copy(ticketFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filePath.toString();

        } catch (IOException e) {
            throw new RuntimeException("Failed to save the ticket", e);
        }
    }
}
