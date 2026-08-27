import { mockAnalysis } from "../data/mockAnalysis";

export async function analyzeImage(image) {
  const base64 = await fileToBase64(image);
  const response = await api("/api/analyze", {
    imageBase64: base64,
    mimeType: image.type || "image/jpeg",
  });

  return normalizeAnalysis(response.analysis);
}

export async function askReality(question, analysis) {
  const response = await api("/api/ask", { question, analysis });
  return response.answer;
}

async function api(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data;
}

function normalizeAnalysis(analysis) {
  if (!analysis || typeof analysis !== "object" || Array.isArray(analysis)) {
    throw new Error("The server returned an invalid analysis. Please try the scan again.");
  }

  return {
    ...mockAnalysis,
    ...analysis,
    object: { ...mockAnalysis.object, ...analysis.object },
    insights: Array.isArray(analysis.insights) ? analysis.insights : [],
    objects: Array.isArray(analysis.objects) && analysis.objects.length ? analysis.objects : mockAnalysis.objects,
    warnings: Array.isArray(analysis.warnings) && analysis.warnings.length ? analysis.warnings : mockAnalysis.warnings,
    suggestedActions: Array.isArray(analysis.suggestedActions) && analysis.suggestedActions.length ? analysis.suggestedActions : mockAnalysis.suggestedActions,
    analyzedAt: new Date().toISOString(),
  };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.readAsDataURL(file);
  });
}
