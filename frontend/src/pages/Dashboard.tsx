import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { SeatMap } from '../components/booking/SeatMap';
import { BookingForm } from '../components/booking/BookingForm';
import { BookingSummary } from '../components/booking/BookingSummary';
import { eventService } from '../services/event.service';
import type { Seat } from '../types';
import toast, { Toaster } from 'react-hot-toast'; // Need to install react-hot-toast if not already
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Dashboard: React.FC = () => {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);

    const fetchSeats = async () => {
        try {
            const data = await eventService.getAllSeats();
            setSeats(data);
        } catch (error) {
            toast.error('Failed to fetch seats');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSeats();
        // Poll every 5 seconds to keep seat status updated
        const interval = setInterval(fetchSeats, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSeatClick = (seatId: number) => {
        setSelectedSeatIds((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            }
            return [...prev, seatId];
        });
    };

    const handleBook = async () => {
        if (!userName.trim()) {
            toast.error('Please enter your name');
            return;
        }

        setIsBooking(true);
        try {
            const response = await eventService.bookSeats({
                userName,
                seatIds: selectedSeatIds,
            });

            if (response.success) {
                toast.success(`Booking confirmed! Total: $${response.totalPrice}`);
                setSelectedSeatIds([]);
                setUserName('');
                fetchSeats(); // Refresh seats immediately
            } else {
                toast.error(response.message || 'Booking failed');
            }
        } catch (error: any) {
            // Axios error handling could be better typed
            const errorMsg = error.response?.data?.message || 'Failed to book seats';
            toast.error(errorMsg);
        } finally {
            setIsBooking(false);
        }
    };

    const handleReset = async () => {
        if (confirm('Are you sure you want to initialize the event? All current bookings will be cleared.')) {
            try {
                await eventService.initializeEvent();
                toast.success('Event reset successfully');
                fetchSeats();
            } catch (error) {
                toast.error('Failed to reset event');
            }
        }
    }

    // Calculate stats
    const totalSeats = seats.length;
    const bookedSeats = seats.filter(s => s.status === 'BOOKED').length;
    const availableSeats = totalSeats - bookedSeats;
    const occupancyRate = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

    return (
        <Layout>
            <Toaster position="top-right" />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
                    <p className="mt-2 text-gray-600">Select seats to book. Pricing varies by booking order.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={fetchSeats} title="Refresh Data">
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                    <Button variant="primary" onClick={handleReset} title="Initialize Event">
                        Initialize Event
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Available Seats</div>
                    <div className="mt-2 text-3xl font-bold text-green-600">{availableSeats}</div>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Booked Seats</div>
                    <div className="mt-2 text-3xl font-bold text-blue-600">{bookedSeats}</div>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Occupancy</div>
                    <div className="mt-2 text-3xl font-bold text-gray-900">{occupancyRate}%</div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <SeatMap
                            seats={seats}
                            selectedSeatIds={selectedSeatIds}
                            onSeatClick={handleSeatClick}
                        />
                    )}
                </div>

                <div className="space-y-6">
                    <BookingForm userName={userName} setUserName={setUserName} disabled={isBooking} />
                    <BookingSummary
                        seats={seats} // Pass all seats to calculate current booking count
                        selectedSeatIds={selectedSeatIds}
                        onBook={handleBook}
                        isBooking={isBooking}
                    />

                    <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                        <h4 className="font-semibold text-blue-900 mb-2">Pricing Tiers</h4>
                        <ul className="space-y-1 text-sm text-blue-800">
                            <li>• First 50 bookings: <strong>$50</strong></li>
                            <li>• Next 30 bookings: <strong>$75</strong></li>
                            <li>• Last 20 bookings: <strong>$100</strong></li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
