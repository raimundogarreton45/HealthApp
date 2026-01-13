const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

exports.chat = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const {message, history, language} = req.body;

      const systemPrompt = `
Eres un Acompañante de Bienestar Emocional.

REGLAS:
- No diagnosticas ni das tratamientos médicos.
- Usas lenguaje empático y claro.
- No reemplazas profesionales.
- Sugieres ayuda profesional si es necesario.

Idioma: ${language}
`;

      const messages = [
        {role: "system", content: systemPrompt},
        ...(history || []),
        {role: "user", content: message},
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
      });

      res.json({
        reply: completion.choices[0].message.content,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({error: "AI error"});
    }
  });
});
