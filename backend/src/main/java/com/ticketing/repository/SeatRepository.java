package com.ticketing.repository;

import com.ticketing.model.Seat;
import com.ticketing.model.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    Optional<Seat> findBySeatNumber(Integer seatNumber);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Seat s WHERE s.id IN :seatIds")
    List<Seat> findByIdInWithLock(List<Long> seatIds);

    List<Seat> findByStatus(SeatStatus status);

    long countByStatus(SeatStatus status);

    @Query("SELECT COUNT(s) FROM Seat s WHERE s.status = 'BOOKED'")
    int countBookedSeats();
}
