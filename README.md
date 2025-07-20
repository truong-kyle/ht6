# Dash2Dorm

_3++'s submission for Hack the 6ix 2025_

**Dash2Dorm** is a smart, fast, and reliable food delivery platform designed for university students. Built by passionate Computer Science and Software Engineering students at York University, our solution combines cutting-edge technology with a deep understanding of campus life to solve real problems: long delivery waits, high costs, and unreliable service.

---

## 🚀 Features

- **AI-Optimized Delivery Routes:** Advanced algorithms (TSP), real-time weather data, and secure payments all in one platform.
- **Smart Matching:** Our algorithm matches you with the nearest available campus carrier for super-fast delivery.
- **Secure Payments:** Pay securely through Stripe with automatic weather fee calculations.
- **University Student Network:** Connect with other students and join our vibrant campus community.

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript
- **Backend:** Python (Stripe integration, API routing)
- **Authentication:** Clerk
- **Database:** Supabase
- **Payments:** Stripe
- **Weather:** Real-time Weather API
- **Routing:** AI/ML for optimized delivery paths

---


## 📈 Stats

- **< 15min** average delivery time
- **95%** on-time rate

---

## 💡 How It Works

1. **Browse & Order:** Search food categories, select items, and confirm your delivery request.
2. **Smart Matching:** Get matched with the nearest available campus courier.
3. **Track in Real-Time:** Monitor your order with live updates and weather-adjusted ETAs.
4. **Pay Securely:** Stripe-powered payments with automatic weather fee calculations.

---

## 👥 Get Involved

Join our campus food delivery community as a **customer** or **carrier**!

---

## 🧑‍💻 Installation

1. Install all node packages using `npm install`
2. Create a virtual environment for the backend and install all requirements in `requirements.txt`
3. Run the frontend with `npm run dev`
4. Start the backend by running `server.py`

---

## 💻 Vellum Code

Our platform integrates Vellum for AI-powered delivery routing and smart incentive workflows.  
Below is a real code example from our project showing how we call Vellum in production:

```typescript
// src/services/checkIncentives.tsx

export async function checkIncentive() {
  try {
    const response = await fetch("https://api.vellum.ai/workflows/run", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_VELLUM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "inputs": [
          {
            "name": "Weather",
            "type": "STRING",
            "value": "Clear"
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
        "workflow_deployment_name": import.meta.env.VITE_VELLUM_WORKFLOW ?? "inclement-weather",
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
```

- **Environment variables required:**  
  - `VITE_VELLUM_API_KEY`  
  - `VITE_VELLUM_WORKFLOW`  

This workflow lets Dash2Dorm dynamically respond to real campus demand, weather, and active delivery walkers—enabling smart routing and incentive logic for our student couriers.  

Vellum Workflow: https://app.vellum.ai/workflow-sandboxes/0aa4150b-efc9-4c97-bba1-fdc1ea23a2f7

---

## 🗝️ Environment Variables

Paste these into a `.env` file:
```
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=your_backend_url
VITE_VELLUM_API_KEY=your_vellum_api_key
FRONTEND_URL=your_frontend_url
VITE_VELLUM_WORKFLOW=your_vellum_workflow
```

---

## 🏫 Meet the Creators

Built by students at York University for students everywhere.  
_"We built Dash2Dorm to solve real problems we faced as students—long food delivery waits, high costs, and unreliable service. Our solution combines cutting-edge technology with deep understanding of campus life."_  
**— The Dash2Dorm Team**

---

## 📬 Contact

For questions, contributions, or to join our team, open an issue or reach out through GitHub!
