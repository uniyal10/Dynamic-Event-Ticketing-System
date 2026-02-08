import React from 'react';
import type { Seat } from '../../types';
import { cn } from '../ui/Button';

interface SeatMapProps {
    seats: Seat[];
    selectedSeatIds: number[];
    onSeatClick: (seatId: number) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeatIds, onSeatClick }) => {
    // Sort seats by ID to ensure correct grid order 1-100
    const sortedSeats = [...seats].sort((a, b) => a.id - b.id);

    const getSeatColor = (seat: Seat) => {
        if (seat.status === 'BOOKED') return 'bg-gray-400 cursor-not-allowed';
        if (selectedSeatIds.includes(seat.id)) return 'bg-blue-600 text-white hover:bg-blue-700';
        return 'bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50';
    };

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[500px] p-4">
                {/* Stage Visualization */}
                <div className="mb-8 w-full">
                    <div className="mx-auto w-2/3 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-medium shadow-inner transform -perspective-x-12">
                        STAGE
                    </div>
                </div>

                {/* Seats Grid */}
                <div className="grid grid-cols-10 gap-3 place-items-center">
                    {sortedSeats.map((seat) => (
                        <button
                            key={seat.id}
                            onClick={() => seat.status === 'AVAILABLE' && onSeatClick(seat.id)}
                            disabled={seat.status !== 'AVAILABLE'}
                            className={cn(
                                'w-10 h-10 rounded-t-lg rounded-b-md flex items-center justify-center text-xs font-semibold transition-all duration-200 shadow-sm',
                                getSeatColor(seat)
                            )}
                            title={`Seat ${seat.seatNumber} - ${seat.status}`}
                        >
                            {seat.seatNumber}
                        </button>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 border-gray-300 bg-white" />
                        <span className="text-sm text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-600" />
                        <span className="text-sm text-gray-600">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-400" />
                        <span className="text-sm text-gray-600">Booked</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
