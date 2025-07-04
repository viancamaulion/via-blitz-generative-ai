import React from "react"

interface WeatherData {
  location: string;
  temperature: number;
  conditions: string;
  humidity: number;
  windSpeed: number;
  timestamp?: string;
}

/**
 * WeatherDisplay
 * Displays weather information in a visually appealing and accessible manner.
 *
 * @param weather - Weather data object to display.
 */
export const WeatherDisplay = ({ weather }: { weather: WeatherData | string }) => {
  if (!weather) return null;

  // Handle case where weather is a string (for backward compatibility)
  if (typeof weather === 'string') {
    return (
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm">
        <span role='img' aria-label='Weather' className='text-2xl'>🌤️</span>
        <span className='font-medium text-blue-900'>{weather}</span>
      </div>
    );
  }

  // Handle structured weather data
  const { location, temperature, conditions, humidity, windSpeed } = weather as WeatherData;
  
  // Get appropriate weather emoji based on conditions
  const getWeatherEmoji = (conditions: string) => {
    const lowerConditions = conditions.toLowerCase();
    if (lowerConditions.includes('sunny')) return '☀️';
    if (lowerConditions.includes('cloud')) return '☁️';
    if (lowerConditions.includes('rain')) return '🌧️';
    if (lowerConditions.includes('snow')) return '❄️';
    return '🌤️';
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span role='img' aria-label='Weather' className='text-3xl'>
          {getWeatherEmoji(conditions)}
        </span>
        <div>
          <h3 className="font-bold text-lg text-blue-900">Weather in {location}</h3>
          <p className="text-2xl font-bold">{temperature}°C</p>
          <p className="capitalize">{conditions}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
        <div>Humidity: {humidity}%</div>
        <div>Wind: {windSpeed} km/h</div>
      </div>
    </div>
  );
};
