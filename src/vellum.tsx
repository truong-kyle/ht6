// npm install vellum-ai --save
import { VellumClient, Vellum } from "vellum-ai";

// configurable parameters
const workflowDeploymentName = "inclement-weather";
const releaseTag = "LATEST";
const inputs: Vellum.WorkflowRequestInputRequest[] = [
  {
    type: "STRING",
    name: "Weather",
    value: "<example-string-value>",
  },
  {
    type: "STRING",
    name: "Time of day",
    value: "<example-string-value>",
  },
  {
    type: "STRING",
    name: "Temperature",
    value: "<example-string-value>",
  },
  {
    type: "STRING",
    name: "Demand",
    value: "<example-string-value>",
  },
  {
    type: "STRING",
    name: "Active Walkers",
    value: "<example-string-value>",
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
