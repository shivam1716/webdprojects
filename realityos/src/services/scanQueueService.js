const QUEUE_KEY = "realityos-scan-queue";
const MAX_QUEUE_SIZE = 5;

export async function enqueueScan(file, mode = "auto", language = navigator.language || "en-US") {
  const dataUrl = await fileToDataUrl(file);
  const item = {
    id: `queued-${Date.now()}`,
    name: file.name || "RealityOS capture",
    mimeType: file.type || "image/jpeg",
    dataUrl,
    mode,
    language,
    createdAt: new Date().toISOString(),
  };
  const queue = readQueue();
  localStorage.setItem(QUEUE_KEY, JSON.stringify([item, ...queue].slice(0, MAX_QUEUE_SIZE)));
  notifyQueueChanged();
  return item;
}

export function getQueuedScans() {
  return readQueue();
}

export function removeQueuedScan(id) {
  const next = readQueue().filter((item) => item.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
  notifyQueueChanged();
}

export function queuedScanToFile(item) {
  const [header, encoded] = String(item?.dataUrl || "").split(",");
  if (!header || !encoded) throw new Error("This queued capture is no longer readable.");
  const binary = window.atob(encoded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new File([bytes], item.name || `realityos-queued-${Date.now()}.jpg`, { type: item.mimeType || header.match(/data:(.*?);/)?.[1] || "image/jpeg" });
}

function readQueue() {
  try {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    return Array.isArray(queue) ? queue : [];
  } catch {
    return [];
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The capture could not be saved for later."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function notifyQueueChanged() {
  window.dispatchEvent(new CustomEvent("realityos:scan-queue"));
}
