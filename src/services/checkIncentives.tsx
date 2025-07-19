// Execute Workflow (POST /v1/execute-workflow)
import { getNextHourWeather } from "./weatherService";

let currentWeather = await getNextHourWeather();


export async function checkIncentive() {       //USE THIS TO SHOW INCENTIVE, however, you can also use the dynamic pricing
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
          "value": currentWeather?.temperature2m || "22"
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
  const body = await response.json();
  const finalStatus = body.data.outputs[0].value;
  console.log("Workflow executed successfully:", finalStatus);

  return finalStatus;
}

