import { getNextHourWeather } from "./weatherService";


const basefee = 2   // Base fee in CAD
const perKmFee = 2   // Fee per kilometer in CAD
const inclementWeatherFee = 0.5 // Additional fee for inclement weather in CAD




export function calculatePricing (distance: number): number {
    // Calculate total price based on distance
    const totalPrice = basefee + (perKmFee * distance);
    return totalPrice;
}