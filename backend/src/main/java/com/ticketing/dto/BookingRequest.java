package com.ticketing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    @NotNull(message = "Number of seats cannot be null")
    private Long numberOfSeats;

    @NotEmpty(message = "Seat IDs cannot be empty")
    private List<@NotNull(message = "Seat ID cannot be null") Long> seatIds;

    @NotBlank(message = "User name is required")
    private String userName;
}
