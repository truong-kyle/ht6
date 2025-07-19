import { checkIncentive } from "./checkIncentives";

const basefee = 0  // Base fee in CAD
const perKmFee = 2   // Fee per kilometer in CAD
let incentive = 0.0 // Default Incentive for demand, e.g., weather conditions, in CAD

export async function calculatePricing (distance: number): Promise<number> {

    // Check if there is an incentive based on weather or other conditions
    const incentiveValue = await checkIncentive();

    if (incentiveValue.activateIncentive) {
        // If there is an incentive, apply it to the total price
        incentive = parseFloat(incentiveValue);
    }

    // Calculate total price based on distance
    const totalPrice = basefee + (perKmFee * distance) + incentive;
    console.log(`Base fee: ${basefee}, Per km fee: ${perKmFee}, Distance: ${distance}, Incentive: ${incentive}, Total Price: ${totalPrice}`);
    return totalPrice;
}