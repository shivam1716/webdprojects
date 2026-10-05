const STORAGE_KEY = "realityos-memories";

export function saveMemory(insight, analysis) {
  const memory = {
    id: `memory-${Date.now()}`,
    title: insight.label,
    detail: `${insight.value} · ${analysis.object?.name || "RealityOS scan"}`,
    value: insight.value,
    source: analysis.object?.name || "RealityOS scan",
    createdAt: new Date().toISOString(),
  };
  const memories = getMemories();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([memory, ...memories].slice(0, 50)));
  return memory;
}

export function getMemories() {
  try {
    const memories = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(memories) ? memories : [];
  } catch {
    return [];
  }
}

export function removeMemory(id) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getMemories().filter((memory) => memory.id !== id)));
}
