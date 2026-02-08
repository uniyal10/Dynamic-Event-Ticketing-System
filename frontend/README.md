# Event Ticketing Frontend

A React + TypeScript application for the Event Ticketing System.

## 🚀 Features

- **Interactive Seat Map**: View 100 seats in a grid layout
- **Real-time Updates**: Seat status reflects current database state
- **Dynamic Pricing**:
  - $50 for first 50 bookings
  - $75 for next 30 bookings
  - $100 for last 20 bookings
- **Booking Management**: Select multiple seats and book instantly
- **Dashboard**: View occupancy rates and available seats

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6
- **Icons**: Lucide React

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- Backend running on port 8080

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start dev server
npm run dev
```

App will run at [http://localhost:5173](http://localhost:5173)

### Build

```bash
# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── booking/       # SeatMap, BookingForm, BookingSummary
│   ├── layout/        # Layout, Header, Footer
│   └── ui/            # Reusable UI components
├── pages/             # Page components (Dashboard)
├── services/          # API services
├── types/             # TypeScript interfaces
└── App.tsx            # Main application component
```
