// npm install vellum-ai --save
import { VellumClient, Vellum } from "vellum-ai";

// configurable parameters
const workflowDeploymentName = "inclement-weather";
const releaseTag = "LATEST";
const inputs: Vellum.WorkflowRequestInputRequest[] = [
  {
    type: "STRING",
    name: "Weather",
    value: "<Sunny>",
  },
  {
    type: "STRING",
    name: "Time of day",
    value: "<Afternoon>",
  },
  {
    type: "STRING",
    name: "Temperature",
    value: "<25°C>",
  },
  {
    type: "STRING",
    name: "Demand",
    value: "<High>",
  },
  {
    type: "STRING",
    name: "Active Walkers",
    value: "<10>",
  },
]

// create your API key here: https://app.vellum.ai/api-keys#keys
const vellum = new VellumClient({
  apiKey: process.env.VELLUM_API_KEY!,
});

// setup the workflow
const request: Vellum.ExecuteWorkflowRequest = {
  workflowDeploymentName,
  releaseTag,
  inputs,
};

// execute the workflow
const result = await vellum.executeWorkflow(request);

if (result.data.state === "REJECTED") {
  throw new Error(result.data.error!.message)
}

console.log(result.data.outputs);
