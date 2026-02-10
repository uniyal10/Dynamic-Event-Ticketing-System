package com.ticketing.controller;

import com.ticketing.dto.BookingRequest;
import com.ticketing.dto.BookingResponse;
import com.ticketing.model.Seat;
import com.ticketing.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
@Tag(name = "Event Ticketing", description = "APIs for managing event seats and bookings")
public class EventController {

    private final EventService eventService;

    @Operation(summary = "Initialize Event", description = "Creates 100 seats for the event. This endpoint clears any existing seats and creates fresh seats numbered 1-100, all with AVAILABLE status.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Event initialized successfully", content = @Content(mediaType = "application/json"))
    })
    @PostMapping("/initialize")
    public ResponseEntity<Map<String, String>> initializeEvent( @RequestParam(required = false) Integer numberOfSeats) {
        log.info("Received request to initialize event");
        int seatsToInitialize = numberOfSeats != null ? numberOfSeats : 100;
        String message = eventService.initializeEvent(seatsToInitialize);
        return ResponseEntity.ok(Map.of(
                "success", "true",
                "message", message));
    }

    @Operation(summary = "Get All Seats", description = "Returns the current status of all 100 seats including seat number, status (AVAILABLE/BOOKED/RESERVED), and timestamps.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all seats", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Seat.class)))
    })
    @GetMapping("/seats")
    public ResponseEntity<List<Seat>> getAllSeats(@RequestParam(required = false) String numberOf) {
        log.info("Received request to get all seats");
        List<Seat> seats = eventService.getAllSeats();
        return ResponseEntity.ok(seats);
    }

    @Operation(summary = "Book Seats", description = "Books one or more seats for a user. Pricing is dynamic based on cumulative booking order: "
            +
            "Tier 1 (bookings 1-50): $50 each, Tier 2 (bookings 51-80): $75 each, Tier 3 (bookings 81-100): $100 each. "
            +
            "Uses pessimistic locking to prevent concurrent booking conflicts.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Seats booked successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request (missing fields, invalid seat IDs)", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "409", description = "Conflict - One or more seats are already booked", content = @Content(mediaType = "application/json"))
    })
    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookSeats(@Valid @RequestBody BookingRequest request) {
        log.info("Received booking request: {}", request);
        BookingResponse response = eventService.bookSeats(request);
        return ResponseEntity.ok(response);
    }
}
