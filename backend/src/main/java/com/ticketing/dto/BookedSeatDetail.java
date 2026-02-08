package com.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookedSeatDetail {

    private Long seatId;
    private Integer seatNumber;
    private BigDecimal price;
    private Integer bookingOrder;
}
