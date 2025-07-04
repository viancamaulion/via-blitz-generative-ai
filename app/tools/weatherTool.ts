import { tool } from "ai"
import z from "zod"

export const getWeather = tool({
  description: "Get the weather in a location",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }: { location: string }) => {
    console.log(`[getWeather tool] Used for location: ${location}`)
    try {
      // TODO: Implement actual weather API call
      const weatherData = {
        location,
        temperature: 10 + Math.floor(Math.random() * 23), // random temp in Celsius for demo
        conditions: ['sunny', 'cloudy', 'rainy', 'partly cloudy'][Math.floor(Math.random() * 4)],
        humidity: 30 + Math.floor(Math.random() * 70),
        windSpeed: 5 + Math.floor(Math.random() * 20),
        timestamp: new Date().toISOString()
      };
      return weatherData;
    } catch (error) {
      return `I couldn't get the weather for ${location}. Please try again later.`;
    }
  },
})

// Helper for intent detection and location extraction
export function detectWeatherIntent(userMessage: string): {
  isWeatherIntent: boolean
  location: string
} {
  const weatherIntent = /\b(weather|temperature|forecast)\b/i.test(userMessage)
  let location = ""
  if (weatherIntent) {
    const locationMatch = userMessage.match(/in ([a-zA-Z\s]+)/i)
    if (locationMatch) {
      location = locationMatch[1].trim()
    }
  }
  return { isWeatherIntent: weatherIntent, location }
}
