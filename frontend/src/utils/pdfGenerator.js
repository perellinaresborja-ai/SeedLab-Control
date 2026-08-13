import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

export const generateCertificate = async (tests, batch, variety, companyProfile, primaryTest) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 12;

      // --- HEADER ---
      // Left side: Company Info
      let leftY = yPos;
      if (companyProfile.logo) {
        doc.addImage(companyProfile.logo, 'PNG', 14, leftY, 40, 20);
        leftY += 25;
      } else {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(companyProfile.name || 'Company Name', 14, leftY + 5);
        leftY += 12;
      }
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Tax ID: ${companyProfile.taxId || 'N/A'}`, 14, leftY);
      doc.text(`${companyProfile.address || 'Address not configured'}`, 14, leftY + 5);
      doc.text(`${companyProfile.email || 'Email not configured'}`, 14, leftY + 10);
      leftY += 15;

      // Right side: Document Info & QR
      let rightY = yPos + 5;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text(`BATCH: ${batch?.id || primaryTest?.batch || 'N/A'}`, pageWidth - 14, rightY, { align: 'right' });
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Issued: ${new Date().toLocaleDateString()}`, pageWidth - 14, rightY + 5, { align: 'right' });

      // Generate and add QR Code
      try {
        const verifyUrl = `https://seedlab.local/verify/${primaryTest.id.replace('-','')}`;
        const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 80 });
        doc.addImage(qrDataUrl, 'PNG', pageWidth - 45, rightY + 10, 30, 30);
        rightY += 45;
      } catch (err) {
        console.error('Error generating QR:', err);
        rightY += 15;
      }

      yPos = Math.max(leftY, rightY) + 5;

      // --- TITLE ---
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('TRACEABILITY CERTIFICATE', pageWidth / 2, yPos, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text('Official Quality Control Document', pageWidth / 2, yPos + 6, { align: 'center' });

      yPos += 15;
      doc.setDrawColor(220);
      doc.line(14, yPos, pageWidth - 14, yPos);
      yPos += 10;

      // Helper for Section Titles
      const addSectionTitle = (title, y) => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(title, 14, y);
        return y + 6;
      };

      // --- SECTION 1: DATOS DEL LOTE ---
      yPos = addSectionTitle('1. Batch Details', yPos);
      
      autoTable(doc, {
        startY: yPos,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
          1: { cellWidth: 55 },
          2: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
          3: { cellWidth: 55 }
        },
        body: [
          ['Batch ID:', batch?.id || primaryTest?.batch || 'N/A', 'Variety:', variety?.name || batch?.variety || 'Unknown'],
          ['Production Date:', batch?.date || 'Unknown', '', ''],
          ['Initial Stock:', `${batch?.initialQty || 0} seeds`, 'Current Stock:', `${batch?.currentQty || 0} seeds`],
          ['Current Status:', batch?.status || 'Unknown', '', '']
        ]
      });

      yPos = (doc.lastAutoTable?.finalY || yPos) + 15;

      // --- SECTION 2: PRUEBAS DE GERMINACIÓN ---
      yPos = addSectionTitle('2. Germination Tests', yPos);

      const summaryBody = tests.map(t => {
        const days = Object.keys(t?.dailyCounts || {});
        let totalGerm = 0;
        let totalDead = 0;
        
        days.forEach(d => {
          const val = t.dailyCounts[d];
          if (typeof val === 'number') {
            totalGerm += val;
          } else if (val) {
            totalGerm += (val.germinated || 0);
            totalDead += (val.dead || 0);
          }
        });

        const pct = t?.sampleSize ? Math.round((totalGerm / t.sampleSize) * 100) : 0;

        return [
          t?.id || 'N/A',
          variety?.name || batch?.variety || 'Unknown',
          t?.startDate || 'N/A',
          `${t?.sampleSize || 0} seeds`,
          `${totalGerm} seeds`,
          `${totalDead} seeds`,
          `${pct.toFixed(1)}%`,
          t?.status || 'N/A'
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['TEST ID', 'VARIETY', 'DATE', 'SAMPLE', 'GERM.', 'DEAD', 'SUCC. %', 'STATUS']],
        body: summaryBody,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: [56, 189, 248], fontSize: 8, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { fontSize: 8, halign: 'center' },
        columnStyles: { 6: { fontStyle: 'bold', textColor: [0, 0, 0] } },
        margin: { left: 14, right: 14 }
      });

      yPos = (doc.lastAutoTable?.finalY || yPos) + 15;
      
      // --- SECTION 2.5: TELEMETRY & PARAMETERS ---
      if (primaryTest) {
        yPos = addSectionTitle('2.5 Test Telemetry & Parameters', yPos);
        
        // Calculate telemetry if possible
        const calculateMGT = (dailyCounts) => {
          let totalSeedsDay = 0;
          let totalSeeds = 0;
          Object.keys(dailyCounts || {}).forEach(day => {
            const numDay = parseInt(day);
            const val = dailyCounts[day];
            const germ = typeof val === 'number' ? val : (val?.germinated || 0);
            if (germ > 0) {
              totalSeedsDay += (germ * numDay);
              totalSeeds += germ;
            }
          });
          return totalSeeds > 0 ? (totalSeedsDay / totalSeeds).toFixed(2) : 0;
        };

        const mgt = calculateMGT(primaryTest.dailyCounts);
        
        autoTable(doc, {
          startY: yPos,
          theme: 'plain',
          styles: { fontSize: 9, cellPadding: 2 },
          columnStyles: {
            0: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
            1: { cellWidth: 55 },
            2: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 35 },
            3: { cellWidth: 55 }
          },
          body: [
            ['Technician:', primaryTest.technician || 'N/A', 'Method:', primaryTest.method || 'Standard'],
            ['Target Temp:', primaryTest.targetTemp || 'N/A', 'Mean Germ. Time (MGT):', `${mgt} days`],
          ]
        });
        
        yPos = (doc.lastAutoTable?.finalY || yPos) + 15;
      }

      // --- SECTION 3: DESGLOSE DIARIO ---
      yPos = addSectionTitle('3. Daily Germination Breakdown', yPos);

      const breakdownBody = tests.map(t => {
        const row = [t?.id || 'N/A'];
        for (let day = 1; day <= 7; day++) {
          const val = t?.dailyCounts?.[day];
          if (typeof val === 'number') {
            row.push(`${val}`);
          } else if (val) {
            row.push(val.germinated !== '' && val.germinated !== null && val.germinated !== undefined ? `${val.germinated}` : '-');
          } else {
            row.push('-');
          }
        }
        return row;
      });

      autoTable(doc, {
        startY: yPos,
        head: [['TEST ID', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7']],
        body: breakdownBody,
        theme: 'grid',
        headStyles: { fillColor: [243, 244, 246], textColor: [55, 65, 81], fontSize: 8, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { fontSize: 8, halign: 'center' },
        margin: { left: 14, right: 14 }
      });

      // Render the iframe in base64 if it fails in chromium
      // --- FOOTER ---
      yPos = doc.internal.pageSize.getHeight() - 25;

      doc.setDrawColor(156, 163, 175);
      doc.setLineWidth(0.5);
      
      const addText = (txt, x, y, size, style, color, align) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        // hex to rgb
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        doc.setTextColor(r, g, b);
        doc.text(txt, x, y, { align: align });
      };

      // Left Signature
      doc.line(25, yPos, 85, yPos);
      addText('Quality Manager Signature', 55, yPos + 6, 9, 'normal', '#4b5563', 'center');

      // Right Signature / Seal
      doc.line(pageWidth - 85, yPos, pageWidth - 25, yPos);
      addText('Company Seal', pageWidth - 55, yPos + 6, 9, 'normal', '#4b5563', 'center');

      const dataUri = doc.output('datauristring');
      const blob = doc.output('blob');
      resolve({ dataUri, blobUrl: URL.createObjectURL(blob) });

    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};
