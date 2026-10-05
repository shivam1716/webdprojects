import PDFDocument from 'pdfkit';

const getSeverityColor = (severity) => {
  switch ((severity || '').toLowerCase()) {
    case 'critical': return '#EF4444'; // Red
    case 'high': return '#F97316'; // Orange
    case 'medium': return '#EAB308'; // Yellow
    case 'low': return '#3B82F6'; // Blue
    default: return '#6B7280'; // Gray
  }
};

export const generatePdfReport = async (analysis, projectTitle) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, bufferPages: true });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const ensureSpace = (space) => {
        if (doc.y + space > doc.page.height - doc.page.margins.bottom) {
          doc.addPage();
        }
      };

      const overall = analysis.overall_insights || {};
      const docsCount = overall.documentsAnalyzed || 'N/A';
      
      // COVER PAGE
      doc.moveDown(10);
      doc.fontSize(28).font('Helvetica-Bold').fillColor('#111827').text(`Product Discovery Report`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(18).font('Helvetica').fillColor('#4B5563').text(projectTitle, { align: 'center' });
      doc.moveDown(2);
      
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.text(`Documents Analyzed: ${docsCount}`, { align: 'center' });
      
      doc.addPage();
      
      // TABLE OF CONTENTS
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#111827').text('Table of Contents');
      doc.moveDown(1);
      doc.fontSize(12).font('Helvetica').fillColor('#3B82F6');
      doc.text('1. Executive Summary & Statistics');
      doc.moveDown(0.5);
      doc.text('2. Top Product Problems');
      doc.moveDown(0.5);
      doc.text('3. Key Themes & Pain Points');
      doc.moveDown(0.5);
      doc.text('4. Recommended Roadmap');
      doc.moveDown(0.5);
      doc.text('5. User Segments');
      doc.moveDown(2);

      // EXECUTIVE SUMMARY
      ensureSpace(150);
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#111827').text('1. Executive Summary & Statistics');
      doc.moveDown(1);
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text('Executive Summary');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica').fillColor('#374151').text(analysis.summary || 'No summary available.', { align: 'justify', lineGap: 4 });
      doc.moveDown(1.5);
      
      // OVERALL STATISTICS
      ensureSpace(100);
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text('Overall Statistics');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica').fillColor('#374151');
      doc.text(`• Estimated Customers Reached: ${overall.estimatedCustomers || 'N/A'}`);
      doc.text(`• Overall Sentiment: ${overall.overallSentiment || analysis.sentiment || 'N/A'}`);
      doc.text(`• AI Confidence: ${overall.confidence || analysis.confidence_score || 'N/A'}%`);
      doc.moveDown(1.5);

      // TOP PRODUCT PROBLEMS
      if (analysis.top_problems && Array.isArray(analysis.top_problems) && analysis.top_problems.length > 0) {
        ensureSpace(150);
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#111827').text('2. Top Product Problems');
        doc.moveDown(1);
        
        analysis.top_problems.forEach((prob, i) => {
          ensureSpace(50);
          doc.fontSize(12).font('Helvetica-Bold').fillColor('#111827').text(`${i + 1}. ${prob.problem || prob.title || prob.theme}`);
          doc.fontSize(10).font('Helvetica').fillColor('#4B5563');
          doc.text(`Priority: ${prob.priority} | Impact: `, { continued: true });
          doc.fillColor(getSeverityColor(prob.impact)).text(prob.impact || 'Unknown', { continued: true });
          doc.fillColor('#4B5563').text(` | Frequency: ${prob.frequency || 'N/A'}`);
          doc.moveDown(1);
        });
        doc.moveDown(0.5);
      }
      
      // THEMES
      const themes = analysis.themes || [];
      if (Array.isArray(themes) && themes.length > 0) {
        ensureSpace(150);
        
        // Handle legacy strings vs new objects
        const isLegacy = typeof themes[0] === 'string';
        
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#111827').text('3. Key Themes & Pain Points');
        doc.moveDown(1);
        
        if (isLegacy) {
          doc.fontSize(11).font('Helvetica').fillColor('#374151');
          themes.forEach(t => {
            ensureSpace(20);
            doc.text(`• ${t}`);
          });
          doc.moveDown(1.5);
        } else {
          themes.forEach(t => {
            ensureSpace(100);
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text(t.theme || 'Unnamed Theme');
            
            doc.fontSize(10).font('Helvetica-Bold').fillColor('#4B5563').text(`Severity: `, { continued: true });
            doc.fillColor(getSeverityColor(t.severity)).text(t.severity || 'Unknown', { continued: true });
            doc.fillColor('#4B5563').text(` | Frequency: ${t.frequency || 'N/A'}`);
            
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica').fillColor('#374151').text(t.description || '', { align: 'justify' });
            doc.moveDown(0.5);
            
            if (t.painPoints && t.painPoints.length > 0) {
              ensureSpace(40);
              doc.fontSize(11).font('Helvetica-Bold').fillColor('#111827').text('Pain Points:');
              doc.fontSize(11).font('Helvetica').fillColor('#374151');
              t.painPoints.forEach(p => {
                ensureSpace(20);
                doc.text(`  • ${p}`);
              });
              doc.moveDown(0.5);
            }
            
            if (t.representativeQuotes && t.representativeQuotes.length > 0) {
              ensureSpace(40);
              doc.fontSize(11).font('Helvetica-Bold').fillColor('#111827').text('Representative Quotes:');
              doc.fontSize(10).font('Helvetica-Oblique').fillColor('#4B5563');
              t.representativeQuotes.forEach(q => {
                ensureSpace(30);
                doc.text(`  "${q}"`);
              });
              doc.moveDown(0.5);
            }
            
            if (t.supportingDocuments && t.supportingDocuments.length > 0) {
              ensureSpace(30);
              doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('Supporting Documents:');
              doc.fontSize(10).font('Helvetica').fillColor('#6B7280');
              doc.text(`  ${t.supportingDocuments.join(', ')}`);
            }
            doc.moveDown(1.5);
          });
        }
      }
      
      // ROADMAP
      if (analysis.roadmap && Array.isArray(analysis.roadmap) && analysis.roadmap.length > 0) {
        ensureSpace(150);
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#111827').text('4. Recommended Roadmap');
        doc.moveDown(1);
        
        analysis.roadmap.forEach((item, i) => {
          ensureSpace(60);
          doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text(`Priority ${item.priority || i + 1}: ${item.title}`);
          doc.fontSize(11).font('Helvetica').fillColor('#374151').text(item.reason || '', { align: 'justify' });
          doc.moveDown(1);
        });
        doc.moveDown(0.5);
      }
      
      // USER SEGMENTS
      if (analysis.user_segments && Array.isArray(analysis.user_segments) && analysis.user_segments.length > 0) {
        ensureSpace(150);
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#111827').text('5. User Segments');
        doc.moveDown(1);
        
        analysis.user_segments.forEach(seg => {
          ensureSpace(50);
          doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text(seg.segment || 'Unknown Segment');
          doc.moveDown(0.5);
          if (seg.issues && seg.issues.length > 0) {
            doc.fontSize(11).font('Helvetica').fillColor('#374151');
            seg.issues.forEach(iss => {
              ensureSpace(20);
              doc.text(`• ${iss}`);
            });
          }
          doc.moveDown(1);
        });
      }

      // Add page numbers
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(9).font('Helvetica').fillColor('#9CA3AF');
        doc.text(`Page ${i + 1} of ${pages.count}`, 0, doc.page.height - 30, { align: 'center' });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
