import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Groq SDK with error handling
let groqClient = null;

try {
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  } else {
    console.warn('Groq API Key is not set or is using the default placeholder.');
  }
} catch (error) {
  console.error('Failed to initialize Groq SDK:', error);
}

const SYSTEM_PROMPT = `
You are a Senior Product Discovery Analyst AI.
Your goal is to carefully analyze the provided customer research text (interviews, support chats, survey responses, feature requests) to discover recurring product problems, organize them intelligently, identify business impact, and recommend roadmap priorities.

Treat all uploaded documents as a cohesive set of customer research.
You must automatically discover themes. Do NOT hardcode sample themes. They must emerge from the data.
You must identify recurring customer pain points automatically by clustering similar complaints.
You must estimate how often each issue appears and return a numeric frequency.
You must estimate business impact (Critical, High, Medium, Low) and explain why.
Identify user groups/segments (e.g., Enterprise, Students, New users, etc. or "General Users" if unknown).
Produce an AI-generated roadmap prioritizing problems by frequency, severity, and business impact.
Include real, short quotes extracted from the research to support major themes.
Include the document names where the insights were found in "supportingDocuments".

You must respond ONLY with valid JSON exactly matching the following structure:
{
  "executiveSummary": "A concise 1-2 paragraph executive summary of the research.",
  "overallInsights": {
      "documentsAnalyzed": number,
      "estimatedCustomers": number,
      "overallSentiment": "Positive, Negative, or Neutral",
      "confidence": number
  },
  "themes": [
      {
          "theme": "Theme Name",
          "description": "...",
          "frequency": number,
          "severity": "Critical | High | Medium | Low",
          "businessImpact": "...",
          "affectedSegments": ["...", "..."],
          "painPoints": ["...", "..."],
          "representativeQuotes": ["...", "..."],
          "supportingDocuments": ["Document 1", "Document 2"],
          "recommendedActions": ["...", "..."]
      }
  ],
  "topProblems": [
      {
          "problem": "...",
          "theme": "...",
          "frequency": number,
          "priority": number,
          "impact": "Critical | High | Medium | Low"
      }
  ],
  "userSegments": [
      {
          "segment": "Segment Name",
          "issues": ["...", "..."]
      }
  ],
  "roadmap": [
      {
          "priority": number,
          "title": "...",
          "reason": "..."
      }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Rules:
1. "executiveSummary" must be a string.
2. "themes", "topProblems", "userSegments", and "roadmap" must be arrays of objects.
3. "recommendations" must be an array of strings.
4. Do NOT include markdown blocks like \`\`\`json. Output raw JSON only.
5. Do NOT add any extra fields or commentary outside the JSON.
`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Validates the parsed JSON to ensure it matches the required schema
 * @param {Object} data 
 * @returns {boolean}
 */
const validateResponse = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.executiveSummary !== 'string') return false;
  if (!data.overallInsights || typeof data.overallInsights !== 'object') return false;
  if (!Array.isArray(data.themes)) return false;
  if (!Array.isArray(data.topProblems)) return false;
  if (!Array.isArray(data.userSegments)) return false;
  if (!Array.isArray(data.roadmap)) return false;
  if (!Array.isArray(data.recommendations)) return false;
  return true;
};

/**
 * Analyzes a document using Groq AI and extracts structured insights
 * @param {string} text - The extracted text to analyze
 * @param {number} retries - Number of retries remaining
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<Object>} Structured JSON insights
 */
export const analyzeDocument = async (text, retries = 3, timeoutMs = 30000) => {
  if (!groqClient) {
    throw new Error('Groq client is not initialized. Please configure GROQ_API_KEY in .env.');
  }

  if (!text || typeof text !== 'string') {
    throw new Error('Valid text content is required for analysis.');
  }

  try {
    // Setup AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const completion = await groqClient.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Analyze the following document:\n\n${text}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }, { signal: controller.signal });

    clearTimeout(timeoutId);

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('Empty response received from Groq API');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseContent);
    } catch (parseError) {
      throw new Error(`Failed to parse Groq response as JSON: ${parseError.message}`);
    }

    if (!validateResponse(parsedData)) {
      throw new Error('Groq response does not match the required JSON schema');
    }

    return parsedData;

  } catch (error) {
    const isAbort = error.name === 'AbortError';
    
    if (isAbort) {
      console.error('Groq API request timed out');
    } else {
      console.error(`Groq API Error: ${error.message}`);
    }

    // Don't retry on authentication or bad request errors (400, 401, 403, 404)
    // The Groq SDK adds a `status` property for HTTP errors
    const isClientError = error.status && error.status >= 400 && error.status < 500 && error.status !== 429;

    if (retries > 0 && !isClientError) {
      console.log(`Retrying... (${retries} attempts left)`);
      await delay(2000); // Wait 2s before retry
      return analyzeDocument(text, retries - 1, timeoutMs);
    }

    throw new Error(`Analysis failed: ${error.message}`);
  }
};

/**
 * Streams an AI chat response to the client based on project context
 * @param {Array} chatMessages - Array of {role, content} objects
 * @param {string} contextString - The stringified project data context
 * @param {Object} res - Express response object for streaming
 * @returns {Promise<string>} The full concatenated response string
 */
export const streamChatResponse = async (chatMessages, contextString, res) => {
  if (!groqClient) {
    throw new Error('Groq client is not initialized.');
  }

  const CHAT_SYSTEM_PROMPT = `You are InsightFlow AI, an intelligent Product Discovery Assistant.
Your goal is to answer questions based ONLY on the following project context.
If the answer is not present in the provided context, you MUST reply exactly with: "I couldn't find evidence for that in the uploaded customer research."
Do not use outside knowledge. Keep your answers concise, professional, and directly related to the product data.

Context:
${contextString}`;

  const messages = [
    { role: 'system', content: CHAT_SYSTEM_PROMPT },
    ...chatMessages
  ];

  try {
    const stream = await groqClient.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      stream: true,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        res.write(content);
      }
    }
    
    return fullResponse;
  } catch (error) {
    console.error('Streaming Chat Error:', error);
    throw error;
  }
};
