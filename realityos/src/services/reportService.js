export function downloadAnalysisReport(analysis) {
  const blob = new Blob([formatAnalysisReport(analysis)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `realityos-${slugify(analysis.object?.name || "scan")}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function shareAnalysisReport(analysis) {
  const text = formatAnalysisReport(analysis);
  if (navigator.share) {
    await navigator.share({ title: `RealityOS · ${analysis.object?.name || "Scan"}`, text });
    return "Share sheet opened.";
  }
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return "Report copied to clipboard.";
  }
  return "Sharing is not supported in this browser.";
}

function formatAnalysisReport(analysis) {
  const insights = (analysis.insights || []).map((item) => `- ${item.label}: ${item.value} (${item.confidence}% confidence)`).join("\n");
  return [
    "REALITYOS SNAPSHOT",
    `Captured: ${new Date(analysis.analyzedAt || Date.now()).toLocaleString()}`,
    `Detected: ${analysis.object?.name || "Unknown"}`,
    `Confidence: ${analysis.object?.confidence || analysis.score || 0}%`,
    "",
    analysis.summary || "No summary available.",
    "",
    "EXTRACTED INFORMATION",
    insights || "- No structured information detected.",
  ].join("\n");
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "scan";
}
