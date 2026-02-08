import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Seat } from '../../types';

interface BookingSummaryProps {
    selectedSeatIds: number[];
    seats: Seat[];
    onBook: () => void;
    isBooking: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
    selectedSeatIds,
    seats,
    onBook,
    isBooking,
}) => {
    const calculations = useMemo(() => {
        const bookedCount = seats.filter((s) => s.status === 'BOOKED').length;
        let currentCount = bookedCount;
        let totalPrice = 0;
        const seatDetails: { id: number; number: number; price: number }[] = [];

        selectedSeatIds.forEach((id) => {
            currentCount++;
            let price = 0;
            if (currentCount <= 50) price = 50;
            else if (currentCount <= 80) price = 75;
            else price = 100;

            totalPrice += price;
            const seat = seats.find((s) => s.id === id);
            if (seat) {
                seatDetails.push({ id, number: seat.seatNumber, price });
            }
        });

        return { totalPrice, seatDetails };
    }, [selectedSeatIds, seats]);

    if (selectedSeatIds.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">Select seats to view details and price.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {calculations.seatDetails.map((seat) => (
                        <div key={seat.id} className="flex justify-between items-center text-sm">
                            <span>Seat {seat.number}</span>
                            <span className="font-medium">${seat.price.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span>${calculations.totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={onBook}
                    isLoading={isBooking}
                    disabled={selectedSeatIds.length === 0}
                >
                    Book {selectedSeatIds.length} Seat{selectedSeatIds.length > 1 ? 's' : ''}
                </Button>
            </CardContent>
        </Card>
    );
};
