import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT || 8787);
const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const key = process.env.GEMINI_API_KEY;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

app.use(express.json({ limit: "15mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, aiConfigured: Boolean(key) });
});

app.post("/api/analyze", async (request, response, next) => {
  const { imageBase64, mimeType } = request.body;
  if (!imageBase64 || !mimeType) {
    return response.status(400).json({ error: "An image is required." });
  }

  try {
    const text = await generate([
      { inlineData: { mimeType, data: imageBase64 } },
      { text: analysisPrompt },
    ]);
    response.json({ analysis: parseJson(text) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/ask", async (request, response, next) => {
  const { question, analysis } = request.body;
  if (!question || !analysis) {
    return response.status(400).json({ error: "A question and analysis are required." });
  }

  try {
    const answer = await generate([{
      text: `You are RealityOS, a concise visual assistant. Answer only from the analysis below. If the answer is not supported, say so plainly.\n\nAnalysis:\n${JSON.stringify(analysis)}\n\nQuestion: ${question}`,
    }]);
    response.json({ answer });
  } catch (error) {
    next(error);
  }
});

app.use(express.static(path.join(root, "dist")));
app.get("/{*splat}", (_request, response) => {
  response.sendFile(path.join(root, "dist", "index.html"));
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(error.status || 500).json({ error: error.message || "The AI request failed." });
});

app.listen(port, () => console.log(`RealityOS backend listening on http://localhost:${port}`));

async function generate(parts) {
  if (!key) {
    const error = new Error("Gemini is not configured on the server.");
    error.status = 503;
    throw error;
  }

  const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ contents: [{ parts }] }),
  });
  const payload = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    const error = new Error(payload?.error?.message || `Gemini request failed (${upstream.status}).`);
    error.status = upstream.status === 429 ? 429 : 502;
    throw error;
  }

  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  if (!text) throw new Error("Gemini returned no usable response.");
  return text;
}

function parseJson(text) {
  const clean = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(clean);
  } catch {
    const error = new Error("Gemini returned an invalid analysis. Please try again.");
    error.status = 502;
    throw error;
  }
}

const analysisPrompt = `Analyze this image for RealityOS. Return only valid JSON matching this shape:
{
  "object":{"name":"string","type":"string","confidence":0},
  "score":0,
  "summary":"string",
  "insights":[{"id":1,"label":"string","value":"string","type":"text","confidence":0,"verified":true,"evidence":"string"}],
  "warnings":[{"title":"string","description":"string","severity":"low"}],
  "objects":[{"id":1,"name":"string","confidence":0}],
  "suggestedActions":[{"id":"task","title":"string","description":"string","priority":"MEDIUM"}]
}
Extract useful visible facts only. Use an empty insights array when none are visible. Give every numeric confidence and score an integer from 0 to 100. Include at least one warning, object, and suggested action.`;
