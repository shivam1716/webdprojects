const STORAGE_KEY = "realityos-history";

export function saveAnalysisToHistory(analysis) {
  const item = {
    id: `scan-${Date.now()}`,
    title: analysis.object?.name || "Untitled scan",
    detail: buildDetail(analysis),
    time: "Just now",
    summary: analysis.summary || "RealityOS analyzed this scan.",
    fields: (analysis.insights || []).slice(0, 8).map((insight) => [insight.label, insight.value]),
    confidence: analysis.object?.confidence || analysis.score || 0,
    analysis,
  };

  const history = readHistory();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...history].slice(0, 25)));
  window.dispatchEvent(new CustomEvent("realityos:activity"));
  return item;
}

export function getSavedAnalyses() {
  return readHistory();
}

function readHistory() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function buildDetail(analysis) {
  const due = analysis.insights?.find((item) => /due|deadline|expiry|date/i.test(item.label));
  const amount = analysis.insights?.find((item) => /amount|price|cost|total/i.test(item.label));
  return [amount?.value, due?.value].filter(Boolean).join(" · ") || "Live visual analysis";
}
