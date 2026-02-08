export interface Seat {
    id: number;
    seatNumber: number;
    status: 'AVAILABLE' | 'BOOKED' | 'RESERVED';
    seatPrice?: number; // Optional as it might not be in the initial fetch
}

export interface BookedSeatDetail {
    seatId: number;
    seatNumber: number;
    price: number;
    bookingOrder: number;
}

export interface BookingResponse {
    success: boolean;
    message: string;
    totalPrice: number;
    seats: BookedSeatDetail[];
    bookingId: number;
}

export interface BookingRequest {
    userName: string;
    seatIds: number[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}
