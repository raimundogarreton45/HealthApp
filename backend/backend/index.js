import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("MindfulSpace AI backend running ✅");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, history = [], language = "es" } = req.body;

    const messages = [
      {
        role: "system",
        content:
          "Eres un acompañante emocional empático. No entregas diagnósticos médicos ni reemplazas atención profesional.",
      },
      ...history,
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend escuchando en puerto", PORT);
});
