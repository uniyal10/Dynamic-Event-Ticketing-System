package com.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private boolean success;
    private String message;
    private BigDecimal totalPrice;
    private List<BookedSeatDetail> seats;
    private Long bookingId;

    public BookingResponse(boolean success, String message, BigDecimal totalPrice, List<BookedSeatDetail> seats) {
        this.success = success;
        this.message = message;
        this.totalPrice = totalPrice;
        this.seats = seats;
    }
}
