import api from './api';
import type { Seat, BookingRequest, BookingResponse } from '../types';

export const eventService = {
    // Initialize event with 100 seats
    initializeEvent: async () => {
        const response = await api.post('/initialize');
        return response.data;
    },

    // Get all seats status
    getAllSeats: async (): Promise<Seat[]> => {
        const response = await api.get<Seat[]>('/seats');
        return response.data;
    },

    // Book seats
    bookSeats: async (bookingRequest: BookingRequest): Promise<BookingResponse> => {
        const response = await api.post<BookingResponse>('/book', bookingRequest);
        return response.data;
    }
};
