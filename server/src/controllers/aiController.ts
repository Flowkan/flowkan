import type { Request, Response } from "express";
// uso temporal
export const generateDescription = async (req: Request, res: Response) => {
  const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
  const AI_MODEL = "google/gemma-3-27b-it:free";
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Missing title" });
    }

    const prompt = `Genera una descripción detallada y productiva para la tarea titulada: "${title}".`;

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente que ayuda a redactar descripciones de tareas.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: false, // WIP: pending stream
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content || "";

    return res.json({ description });
  } catch (error) {
    console.error("Error generating AI description:", error);
    return res.status(500).json({
      error: "Error generating description",
      message: (error as Error).message,
    });
  }
};
