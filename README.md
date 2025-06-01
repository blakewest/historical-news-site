# The Historical Times

A React web application that displays historical news from exactly 100 years ago today, styled after the New York Times.

## Features

- Shows historical events from exactly 100 years ago today
- Uses Gemini API for researching and generating authentic historical content
- Organizes articles by newspaper categories (politics, international, local, etc.)
- Displays AI-generated images of historical people and events
- Provides on-demand "Additional Context" for deeper historical understanding
- Includes integration with Gemini Veo API for video generation (placeholder implementation)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running the Application

Start the development server:
```
npm run dev
```

The application will be available at http://localhost:5173/

## Implementation Details

- **React**: Frontend framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Axios**: API requests
- **Gemini API**: Content generation

## Project Structure

- `/src/components`: React components
- `/src/services`: API service interfaces
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions
- `/src/config`: Application configuration

## Notes

- Without a valid Gemini API key, the application will display mock data
- For a production application, API keys should be handled securely through a backend
- The Gemini Veo API integration is a placeholder and would require the actual API in production