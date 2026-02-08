package com.ticketing.repository;

import com.ticketing.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserName(String userName);

    @Query("SELECT COALESCE(MAX(b.bookingOrder), 0) FROM Booking b")
    Integer findMaxBookingOrder();
}
