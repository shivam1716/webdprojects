import { extractDocument } from './services/extractionService.js';

const runTest = async () => {
  console.log('Testing Document Extraction Service...\n');

  // 1. Create a dummy TXT file
  const txtContent = `This is a sample document for testing the extraction layer.
  
It has multiple paragraphs. And    some     duplicate whitespace.

And even some weird \x00 characters that should be removed.`;

  const dummyTxtFile = {
    originalname: 'sample.txt',
    mimetype: 'text/plain',
    buffer: Buffer.from(txtContent, 'utf-8')
  };

  // 2. Create a dummy CSV file
  const csvContent = `Name,Role,Feedback\nAlice,Manager,Great feature!\nBob,Developer,"Needs more work, especially UX"\n`;
  const dummyCsvFile = {
    originalname: 'feedback.csv',
    mimetype: 'text/csv',
    buffer: Buffer.from(csvContent, 'utf-8')
  };

  try {
    console.log('--- Testing TXT Extraction ---');
    const txtResult = await extractDocument(dummyTxtFile);
    printResult(txtResult);

    console.log('\n--- Testing CSV Extraction ---');
    const csvResult = await extractDocument(dummyCsvFile);
    printResult(csvResult);

    console.log('\n✅ All tests passed successfully!');
  } catch (error) {
    console.error('❌ Extraction failed:', error.message);
  }
};

const printResult = (result) => {
  console.log(`File Type:       ${result.fileType}`);
  console.log(`Page Count:      ${result.pageCount}`);
  console.log(`Word Count:      ${result.wordCount}`);
  console.log(`Character Count: ${result.characterCount}`);
  console.log(`\n--- First 500 characters ---\n${result.text.substring(0, 500)}`);
  console.log('----------------------------');
};

runTest();
