// Execute Workflow (POST /v1/execute-workflow)
import { getNextHourWeather } from "./weatherService";

export async function checkIncentive() {       //USE THIS TO SHOW INCENTIVE, however, you can also use the dynamic pricing
  try {
    // Get current weather data
    const currentWeather = await getNextHourWeather();
    
    const response = await fetch("https://predict.vellum.ai/v1/execute-workflow", {
      method: "POST",
      headers: {
        "X-API-KEY": import.meta.env.VITE_VELLUM_API_KEY ?? "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "inputs": [
          {
            "name": "Weather",
            "type": "STRING",
            "value": "Sunny"
          },
          {
            "name": "Time of day",
            "type": "STRING",
            "value": new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"
          },
          {
            "name": "Temperature",
            "type": "STRING",
            "value": currentWeather?.temperature2m?.toString() || "22"
          },
          {
            "name": "Demand",
            "type": "STRING",
            "value": "Low Demand"
          },
          {
            "name": "Active Walkers",
            "type": "STRING",
            "value": "10"
          }
        ],
        "workflow_deployment_name": "inclement-weather"
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.json();
    
    if (!body.data || !body.data.outputs || body.data.outputs.length === 0) {
      throw new Error("Invalid response format from Vellum API");
    }

    const finalStatus = body.data.outputs[0].value;
    console.log("Workflow executed successfully:", finalStatus);
    return finalStatus;
    
  } catch (error) {
    console.error("Error in checkIncentive:", error);
    throw error; // Re-throw the error so it can be caught by the caller
  }
}

