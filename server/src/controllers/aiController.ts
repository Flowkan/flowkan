import type { Request, Response } from "express";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const AI_MODELS = [
  "shisa-ai/shisa-v2-llama3.3-70b:free",
  "google/gemma-3-12b-it:free",
  "google/gemma-3-27b-it:free",
  "cognitivecomputations/dolphin3.0-mistral-24b:free",
  "qwen/qwen3-4b:free",
  "qwen/qwen3-30b-a3b:free",
  "qwen/qwen3-8b:free",
  "tngtech/deepseek-r1t-chimera:free",
  "arliai/qwq-32b-arliai-rpr-v1:free",
  "meta-llama/llama-4-scout:free",
  "qwen/qwen2.5-vl-32b-instruct:free",
];

const attemptGeneration = async (
  title: string,
  modelName: string,
): Promise<string> => {
  const prompt = `Genera una descripción detallada y productiva para la tarea titulada: "${title}".`;

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
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
      stream: false,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const errText = await response.text();
    throw new Error(
      `[${modelName} - Status: ${status}] API Error: ${errText.slice(0, 100)}`,
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

export const generateDescription = async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Missing title" });
  }

  let modelIndex = 0;

  while (modelIndex < AI_MODELS.length) {
    const currentModel = AI_MODELS[modelIndex];

    try {
      console.log(`Intentando generar descripción con modelo: ${currentModel}`);
      const description = await attemptGeneration(title, currentModel);

      return res.json({ description });
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(`[FALLO - ${currentModel}] Error: ${errorMessage}`);
      modelIndex++;
    }
  }

  // FRACASO TOTAL: Si el bucle termina sin éxito
  console.error("Error generating AI description: Todos los modelos fallaron.");
  return res.status(503).json({
    error: "AI service temporarily unavailable",
    message:
      "No se pudo generar la descripción. Todos los modelos fallaron en responder.",
  });
};
