# NSE India Dashboard

A comprehensive React dashboard for visualizing and analyzing data from the National Stock Exchange (NSE) of India.

## Features

- **Market Overview**: Real-time market status, key indices, top gainers/losers
- **Equity Analysis**: Detailed stock information with historical charts
- **Index Analysis**: Index constituents and performance metrics
- **Option Chain**: Complete option chain data for equities, indices, and commodities
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## Prerequisites

Make sure your NSE India API server is running on `http://localhost:3000`. The dashboard expects the following endpoints to be available:

- `/api/marketStatus`
- `/api/allSymbols`
- `/api/allIndices`
- `/api/equity/:symbol`
- `/api/equity/historical/:symbol`
- `/api/equity/tradeInfo/:symbol`
- `/api/equity/corporateInfo/:symbol`
- `/api/index/:indexSymbol`
- `/api/equity/options/:symbol`
- `/api/index/options/:indexSymbol`
- `/api/commodity/options/:commoditySymbol`
- `/api/gainersAndLosers/:indexSymbol`
- `/api/mostActive/:indexSymbol`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## API Configuration

If your NSE API server is running on a different port or host, update the `API_BASE_URL` in `src/services/api.ts`.

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API calls
- **Lucide React** for icons
- **Headless UI** for accessible components

## Project Structure

```
src/
├── components/
│   ├── Layout/          # Layout components (Header, Sidebar, Layout)
│   └── Common/          # Reusable components (StatCard, LoadingSpinner, etc.)
├── pages/               # Page components
├── services/            # API service layer
├── types/               # TypeScript type definitions
└── App.tsx             # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request