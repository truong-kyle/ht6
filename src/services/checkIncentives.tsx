// Execute Workflow (POST /v1/execute-workflow)

export async function checkIncentive() {
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
          "value": "Afternoon"
        },
        {
          "name": "Temperature",
          "type": "STRING",
          "value": "25 C"
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

