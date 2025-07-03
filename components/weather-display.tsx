import React from "react"

/**
 * WeatherDisplay
 * Displays weather information in a visually appealing and accessible manner.
 *
 * @param weather - Weather summary string to display.
 */
export const WeatherDisplay = ({ weather }: { weather: string }) => {
  if (!weather) return null

  return (
    <div
      className='flex items-center gap-3  bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm'
      aria-live='polite'
      role='region'
    >
      <span role='img' aria-label='Weather' className='text-2xl'>
        🌤️
      </span>
      <span className='font-medium text-blue-900'>{weather}</span>
    </div>
  )
}
