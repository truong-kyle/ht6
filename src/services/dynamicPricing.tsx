import { checkIncentive } from "./checkIncentives";

const perKmFee = 5   // Fee per kilometer in CAD
let incentive = 0.0 // Default Incentive for demand, e.g., weather conditions, in CAD

export async function calculatePricing (distance: number): Promise<number> {

    // Check if there is an incentive based on weather or other conditions
    try {
    const incentiveCheck = await checkIncentive();
    if (incentiveCheck.activateIncentive) {
        // If there is an incentive, apply it to the total price
        incentive = parseFloat(incentiveCheck.value);
    }
    } catch (error) {
        console.error("Error checking incentive:", error);
        incentive = 1.0; // Default to no incentive if there's an error
    }


    // Calculate total price based on distance
    const dynamicPrice = (perKmFee * distance) + incentive;
    console.log(`Per km fee: ${perKmFee}, Distance: ${distance}, Incentive: ${incentive}, Total Price with Base Fee: ${dynamicPrice + 2}`); // Adding 2 for the base fee
    return dynamicPrice;
}