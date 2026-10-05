import { analyzeDocument } from './services/groqService.js';

const sampleText = `
Interview Summary: Product Feedback for Q3
Date: October 15, 2026

We spoke with 5 major enterprise clients this week regarding the recent dashboard redesign. 
The general sentiment is quite positive; users appreciate the cleaner look and faster load times.
However, 3 out of 5 clients pointed out that the new data export feature is hard to find.
They recommended adding a more prominent "Export" button near the top right of the reports page.
Additionally, the mobile experience is still slightly buggy when viewing large tables, which causes frustration for on-the-go managers.
Overall, the redesign is a success but needs minor UX tweaks to reach its full potential.
`;

const runTest = async () => {
  console.log('Testing Groq AI Integration...');
  console.log('Sending sample document text:\n', sampleText);
  
  try {
    const result = await analyzeDocument(sampleText);
    console.log('\n✅ Success! Received valid JSON response:\n');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('\n❌ Test Failed:\n', error.message);
  }
};

runTest();
