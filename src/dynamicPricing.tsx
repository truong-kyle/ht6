import { getNextHourWeather } from "./weatherService";


const basefee = 2   // Base fee in CAD
const perKmFee = 2   // Fee per kilometer in CAD
const incentive = 0.0 // Default Incentive for demand, e.g., weather conditions, in CAD

export async function calculatePricing (distance: number): Promise<number> {
    const weatherData = await getNextHourWeather();
    if (!weatherData) {
        throw new Error("Failed to fetch weather data");
    }

    // Calculate total price based on distance
    const totalPrice = basefee + (perKmFee * distance);
    return totalPrice;
}