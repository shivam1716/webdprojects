// Simple in-memory set to track currently executing tasks by project ID
// This prevents double-clicks from running duplicate AI analysis or PDF generation.
export const activeLocks = new Set();
