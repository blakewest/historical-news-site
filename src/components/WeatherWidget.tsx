import React from 'react';
import { WeatherData } from '../types';
import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';

interface WeatherWidgetProps {
  weather?: WeatherData;
  date: Date;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, date }) => {
  if (!weather) {
    return null;
  }

  // Select weather icon based on conditions
  const getWeatherIcon = () => {
    const conditions = weather.conditions.toLowerCase();
    if (conditions.includes('sun') || conditions.includes('clear') || conditions.includes('fair')) {
      return <Sun className="w-8 h-8" />;
    } else if (conditions.includes('rain') || conditions.includes('shower')) {
      return <CloudRain className="w-8 h-8" />;
    } else if (conditions.includes('snow')) {
      return <CloudSnow className="w-8 h-8" />;
    } else {
      return <Cloud className="w-8 h-8" />;
    }
  };

  return (
    <div className="article-card p-4">
      <h3 className="font-serif text-lg font-bold mb-2">New York Weather</h3>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 bg-newspaper-sepia p-2 rounded-full">
          {getWeatherIcon()}
        </div>
        <div>
          <div className="font-bold">{weather.temperature}</div>
          <div className="text-sm">{weather.conditions}</div>
        </div>
      </div>
      <p className="mt-2 text-sm">{weather.description}</p>
    </div>
  );
};

export default WeatherWidget;