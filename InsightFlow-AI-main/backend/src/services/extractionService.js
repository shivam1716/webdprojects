import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
import { parse as parseCsv } from 'csv-parse/sync';

/**
 * Cleans extracted text by normalizing spaces and line endings
 * @param {string} text 
 * @returns {string}
 */
const cleanText = (text) => {
  if (!text) return '';
  return text
    // Normalize line endings to \n
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove non-printable control characters except tab and newline
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Replace multiple spaces/tabs with single space
    .replace(/[ \t]+/g, ' ')
    // Replace 3+ consecutive newlines with exactly 2 newlines (paragraph break)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const countWords = (text) => {
  // Matches consecutive word characters including unicode if supported, 
  // but a simple non-whitespace split is more robust for general text
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Handlers for specific file types
const extractPdf = async (buffer) => {
  const data = await pdfParse(buffer);
  return {
    text: data.text,
    pageCount: data.numpages || 1,
    metadata: data.info || {}
  };
};

const extractDocx = async (buffer) => {
  const result = await mammoth.extractRawText({ buffer });
  return {
    text: result.value,
    pageCount: 1, // Word counts/page counts aren't easily derived from raw text extraction
    metadata: {}
  };
};

const extractCsv = async (buffer) => {
  const rawText = buffer.toString('utf-8');
  // Parse CSV to handle quotes and delimiters cleanly
  const records = parseCsv(rawText, { skip_empty_lines: true });
  
  // Format nicely as rows of text separated by pipes for readability by AI
  const text = records.map(row => row.join(' | ')).join('\n');
  return {
    text,
    pageCount: 1,
    metadata: { rows: records.length }
  };
};

const extractTxt = async (buffer) => {
  return {
    text: buffer.toString('utf-8'),
    pageCount: 1,
    metadata: {}
  };
};

/**
 * Main orchestrator for document extraction
 * @param {Object} file - File object { buffer, originalname, mimetype }
 * @returns {Promise<Object>} Standardized extraction object
 */
export const extractDocument = async (file) => {
  if (!file || !file.buffer) {
    throw new Error('Invalid file object. Expected a file with a buffer.');
  }

  const { buffer, originalname, mimetype } = file;
  
  // Determine extension
  const ext = originalname ? originalname.split('.').pop().toLowerCase() : '';
  let extractionResult;

  // Route to the appropriate handler
  if (ext === 'pdf' || mimetype === 'application/pdf') {
    extractionResult = await extractPdf(buffer);
    extractionResult.fileType = 'PDF';
  } else if (ext === 'docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    extractionResult = await extractDocx(buffer);
    extractionResult.fileType = 'DOCX';
  } else if (ext === 'csv' || mimetype === 'text/csv') {
    extractionResult = await extractCsv(buffer);
    extractionResult.fileType = 'CSV';
  } else if (ext === 'txt' || mimetype === 'text/plain') {
    extractionResult = await extractTxt(buffer);
    extractionResult.fileType = 'TXT';
  } else {
    throw new Error(`Unsupported file type: ${ext || mimetype || 'Unknown'}. Supported types are PDF, DOCX, CSV, TXT.`);
  }

  const cleanedText = cleanText(extractionResult.text);

  return {
    text: cleanedText,
    fileType: extractionResult.fileType,
    pageCount: extractionResult.pageCount || 1,
    wordCount: countWords(cleanedText),
    characterCount: cleanedText.length,
    metadata: extractionResult.metadata || {}
  };
};
