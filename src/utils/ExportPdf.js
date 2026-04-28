import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Exports a medical record to a professional PDF document.
 * Handles different templates for Prescriptions, Lab Results, and general Clinical Records.
 * 
 * @param {Object} record - The medical record object
 * @param {Object} patient - The patient object associated with the record
 */
export const exportMedicalRecordToPdf = (record, patient) => {
  try {
    if (!record) {
      console.error('PDF Export: Missing record data');
      return;
    }
    
    // Initialize PDF (A4 size)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // --- 1. BRANDED HEADER ---
    // Blue header bar
    doc.setFillColor(30, 41, 59); // Slate 800
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Hospital Name / Logo placeholder
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('HEALTHCARE PRO', margin, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Advanced Digital Medical Center', margin, 27);
    doc.text('123 Medical Plaza, Health City, HC 54321', margin, 32);

    // Document Type Label (Top Right)
    const docLabel = (record.type || 'Clinical Record').toUpperCase();
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(docLabel, pageWidth - margin, 25, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`ID Reference: ${record.id || 'N/A'}`, pageWidth - margin, 32, { align: 'right' });

    // --- 2. PATIENT INFO BOX ---
    let currentY = 55;
    
    // Light gray background for info box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, currentY, contentWidth, 35, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, 35, 2, 2, 'D');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PATIENT IDENTIFICATION', margin + 5, currentY + 7);
    
    doc.setLineWidth(0.1);
    doc.line(margin + 5, currentY + 10, margin + contentWidth - 5, currentY + 10);

    // Grid Layout for Patient Details
    doc.setFontSize(9);
    doc.text('NAME:', margin + 5, currentY + 18);
    doc.setFont('helvetica', 'normal');
    doc.text(patient?.name || 'N/A', margin + 35, currentY + 18);

    doc.setFont('helvetica', 'bold');
    doc.text('PATIENT ID:', margin + 95, currentY + 18);
    doc.setFont('helvetica', 'normal');
    doc.text(patient?.pid || 'N/A', margin + 125, currentY + 18);

    doc.setFont('helvetica', 'bold');
    doc.text('DOB / AGE:', margin + 5, currentY + 25);
    doc.setFont('helvetica', 'normal');
    doc.text(`${patient?.dob || 'N/A'} (${patient?.age || 'N/A'} yrs)`, margin + 35, currentY + 25);

    doc.setFont('helvetica', 'bold');
    doc.text('GENDER:', margin + 95, currentY + 25);
    doc.setFont('helvetica', 'normal');
    doc.text(patient?.gender || 'N/A', margin + 125, currentY + 25);

    doc.setFont('helvetica', 'bold');
    doc.text('ADDRESS:', margin + 5, currentY + 32);
    doc.setFont('helvetica', 'normal');
    doc.text(patient?.address || 'N/A', margin + 35, currentY + 32);

    currentY += 45;

    // --- 3. MAIN CONTENT (Conditional Layouts) ---

    if (record.type === 'Prescription') {
      // PRESCRIPTION TEMPLATE
      doc.setFontSize(40);
      doc.setTextColor(200, 200, 200);
      doc.setFont('helvetica', 'bold');
      doc.text('Rx', margin, currentY + 10);
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.text('Prescription Details', margin + 20, currentY + 5);
      
      currentY += 15;

      autoTable(doc, {
        startY: currentY,
        head: [['Medication', 'Instructions / Dosage', 'Duration']],
        body: [
          [record.title || 'N/A', record.notes || 'N/A', 'As directed']
        ],
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 },
        margin: { left: margin, right: margin }
      });

    } else if (record.type === 'Lab Result') {
      // LAB RESULT TEMPLATE
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Laboratory Analysis Report', margin, currentY);
      
      currentY += 8;

      autoTable(doc, {
        startY: currentY,
        head: [['Test Description', 'Found Results', 'Ref. Range', 'Status']],
        body: [
          [record.title || 'N/A', record.notes || 'N/A', 'Normal', 'Verified']
        ],
        theme: 'striped',
        headStyles: { fillColor: [14, 165, 233], textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
        margin: { left: margin, right: margin }
      });
    } else {
      // DEFAULT CLINICAL RECORD
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(record.title || 'Clinical Summary', margin, currentY);
      
      currentY += 8;

      autoTable(doc, {
        startY: currentY,
        head: [['Finding / Observation', 'Clinical Notes']],
        body: [
          [record.title || 'N/A', record.notes || 'N/A']
        ],
        theme: 'plain',
        headStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 },
        margin: { left: margin, right: margin }
      });
    }

    // --- 4. SIGNATURE & AUTHENTICATION ---
    const finalY = doc.lastAutoTable.finalY + 30;
    
    // Clinician Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Ordering Clinician:', margin, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(record.doctor || 'Unauthorized Clinician', margin + 35, finalY);

    // Signature line
    doc.setDrawColor(200, 200, 200);
    doc.line(pageWidth - margin - 60, finalY + 10, pageWidth - margin, finalY + 10);
    doc.setFontSize(8);
    doc.text('Authorized Digital Signature', pageWidth - margin - 30, finalY + 15, { align: 'center' });

    // --- 5. FOOTER ---
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.setFontSize(8);
    const footerText = 'This document is a confidential medical record. Unauthorized reproduction is strictly prohibited. Generated by HealthCare Pro Systems.';
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`Page 1 of 1 | Date: ${record.date || new Date().toLocaleDateString()}`, margin, pageHeight - 10);

    // Output
    const fileName = `${record.type}_${patient?.name.replace(/\s+/g, '_')}_${record.id}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    alert('Failed to generate professional PDF. Please check the dashboard logs.');
  }
};
