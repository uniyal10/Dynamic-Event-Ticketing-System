package com.ticketing.service;

import com.ticketing.dto.BookingRequest;
import com.ticketing.dto.BookingResponse;
import com.ticketing.model.*;
import com.ticketing.repository.BookingRepository;
import com.ticketing.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;

    private static final int TOTAL_SEATS = 100;
    private static final BigDecimal TIER1_PRICE = new BigDecimal("50.00");
    private static final BigDecimal TIER2_PRICE = new BigDecimal("75.00");
    private static final BigDecimal TIER3_PRICE = new BigDecimal("100.00");

    /**
     * Initialize event with 100 seats
     */
    @Transactional
    public String initializeEvent() {
        log.info("Initializing event with {} seats", TOTAL_SEATS);

        // Clear existing seats
        seatRepository.deleteAll();

        // Create 100 seats using batch insert for optimization
        List<Seat> seats = new java.util.ArrayList<>(TOTAL_SEATS);
        for (int i = 1; i <= TOTAL_SEATS; i++) {
            seats.add(new Seat(i));
        }

        // Batch insert all seats in a single operation
        seatRepository.saveAll(seats);

        log.info("Event initialized successfully with {} seats", TOTAL_SEATS);
        return "Event initialized with " + TOTAL_SEATS + " seats";
    }

    /**
     * Get all seats with their current status
     */
    @Transactional(readOnly = true)
    public List<Seat> getAllSeats() {
        log.info("Fetching all seats");
        return seatRepository.findAll();
    }

    /**
     * Book seats with dynamic pricing based on booking order
     */
    @Transactional
    public BookingResponse bookSeats(BookingRequest request) {
        log.info("Processing booking request for user: {} with seats: {}",
                request.getUserName(), request.getSeatIds());

        // 1. Fetch seats with pessimistic lock to prevent concurrent booking
        List<Seat> seats = seatRepository.findByIdInWithLock(request.getSeatIds());

        // 2. Validate all seats exist
        if (seats.size() != request.getSeatIds().size()) {
            throw new IllegalArgumentException("One or more seat IDs are invalid");
        }

        // 3. Check if all seats are available
        List<Seat> unavailableSeats = seats.stream()
                .filter(seat -> seat.getStatus() != SeatStatus.AVAILABLE)
                .collect(Collectors.toList());

        if (!unavailableSeats.isEmpty()) {
            String unavailableSeatNumbers = unavailableSeats.stream()
                    .map(seat -> String.valueOf(seat.getSeatNumber()))
                    .collect(Collectors.joining(", "));
            throw new IllegalStateException("Seats already booked: " + unavailableSeatNumbers);
        }

        // 4. Get current booking order
        int currentBookedCount = seatRepository.countBookedSeats();
        Integer maxBookingOrder = bookingRepository.findMaxBookingOrder();
        int nextBookingOrder = (maxBookingOrder != null ? maxBookingOrder : 0) + 1;

        // 5. Calculate total price based on booking order
        BigDecimal totalPrice = calculatePrice(currentBookedCount, seats.size());

        // 6. Create booking
        Booking booking = new Booking();
        booking.setUserName(request.getUserName());
        booking.setBookingOrder(nextBookingOrder);
        booking.setTotalSeats(seats.size());
        booking.setTotalPrice(totalPrice);
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setBookingDate(LocalDateTime.now());

        // 7. Create booking seats and update seat status
        int seatOrder = currentBookedCount;
        for (Seat seat : seats) {
            seatOrder++;

            // Calculate individual seat price
            BigDecimal seatPrice = getSeatPrice(seatOrder);

            // Create booking seat
            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setSeat(seat);
            bookingSeat.setSeatPrice(seatPrice);
            bookingSeat.setSeatOrder(seatOrder);

            booking.addBookingSeat(bookingSeat);

            // Update seat status
            seat.setStatus(SeatStatus.BOOKED);
        }

        // 8. Save booking (cascades to booking_seats)
        Booking savedBooking = bookingRepository.save(booking);

        // 9. Save updated seats
        seatRepository.saveAll(seats);

        log.info("Booking completed successfully. Booking ID: {}, Total Price: {}",
                savedBooking.getId(), totalPrice);

        // 10. Return response with detailed seat information
        List<com.ticketing.dto.BookedSeatDetail> seatDetails = savedBooking.getBookingSeats().stream()
                .map(bookingSeat -> new com.ticketing.dto.BookedSeatDetail(
                        bookingSeat.getSeat().getId(),
                        bookingSeat.getSeat().getSeatNumber(),
                        bookingSeat.getSeatPrice(),
                        bookingSeat.getSeatOrder()))
                .collect(Collectors.toList());

        return new BookingResponse(
                true,
                "Booking confirmed for " + request.getUserName(),
                totalPrice,
                seatDetails,
                savedBooking.getId());
    }

    /**
     * Calculate total price based on current booking count and number of seats to
     * book
     */
    private BigDecimal calculatePrice(int currentBookedCount, int seatsToBook) {
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (int i = 0; i < seatsToBook; i++) {
            int position = currentBookedCount + i + 1;
            BigDecimal seatPrice = getSeatPrice(position);
            totalPrice = totalPrice.add(seatPrice);
        }

        log.debug("Calculated price for {} seats starting from position {}: {}",
                seatsToBook, currentBookedCount + 1, totalPrice);

        return totalPrice;
    }

    /**
     * Get price for a seat based on its booking order position
     */
    private BigDecimal getSeatPrice(int position) {
        if (position <= 50) {
            return TIER1_PRICE; // $50
        } else if (position <= 80) {
            return TIER2_PRICE; // $75
        } else {
            return TIER3_PRICE; // $100
        }
    }
}
