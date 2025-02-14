# Country Information Explorer

A full-stack web application that provides detailed country information using the REST Countries API, built with Node.js/Express backend and React frontend.

## Features

- **Country List Page**
  - Card-based layout with flags and basic info
  - Real-time local time display (12-hour format)
  - lazy loading
  - Search by country name or capital
  - Filter by region and timezone
  - Filter and Pagination
- **Country Detail Page**
  - Detailed demographic information
  - Currency and language data
  - Interactive map integration
- **Comparison Feature**
  - Side-by-side country comparison
- **Responsive Design**
  - Mobile-first approach
  - Cross-browser compatibility

## Tech Stack

**Frontend:**
- React 19
- Vite
- TypeScript
- Bootstrap 5
- React Router
- Axios

**Backend:**
- Node.js
- Express
- TypeScript
- Axios
- CORS
- REST Countries API

## Project Structure
country-information-app/
├── backend/ # Node.js/Express API server
│ ├── src/
│ ├── package.json
│ └── tsconfig.json
├── frontend/ # React application
│ ├── src/
│ ├── package.json
│ └── vite.config.ts
└── README.md

## Getting Started

### Prerequisites

- Node.js ≥18.x
- npm ≥9.x
- Git

### Installation

1. Clone the repository:

git clone https://github.com/Muhammed-Safwan21/country_information_app.git
cd country_information_app

2. Set up backend:

cd backend
npm install

3. Set up frontend:
cd ../frontend
npm install

4. Start backend server:
cd backend
npm run dev

Server runs on http://localhost:5000 or 3050 from .env

5. Start frontend development server:
cd frontend
npm run dev
Access the app at http://localhost:5173


API Endpoints
Endpoint	Method	Description
/countries	GET	Get all countries
/countries/:code	GET	Get country by code
/countries/region/:region	GET	Filter by region
/countries/search	GET	Search with multiple filters

Search Parameters:

name: Search by country name

capital: Search by capital city

region: Filter by region

timezone: Filter by timezone

Key Implementation Details
Backend:

Type-safe API implementation

Response caching for improved performance

Comprehensive error handling

Request validation middleware

Environment-based configuration

Frontend:

Component-based architecture

Custom hooks for API interaction

Responsive grid layout

Client-side routing

State management with React Context

Loading and error boundaries