// src/services/api.js

export const API_URL = "https://healthapp-4tvj.onrender.com"; // URL de tu backend en Render

export async function sendMessageToAI(message) {
  try {
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    return data.reply; // el backend responde { reply: "..." }
  } catch (err) {
    console.error("Error connecting to AI backend:", err);
    return "Error de conexión. Intenta de nuevo.";
  }
}
