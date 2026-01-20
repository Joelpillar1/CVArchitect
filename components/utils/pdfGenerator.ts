import { jsPDF } from 'jspdf';
import { ResumeData } from '../../types';
import { descriptionToString } from '../../utils/templateUtils';

export const generatePDF = (data: ResumeData) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper to check if we need a new page
    const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };

    // Helper to add a horizontal line
    const addLine = () => {
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 3;
    };

    // Helper to add section header
    const addSectionHeader = (title: string) => {
        checkPageBreak(15);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(title.toUpperCase(), margin, yPosition);
        yPosition += 2;
        doc.setLineWidth(0.8);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
    };

    // === HEADER ===
    doc.setFontSize(data.fontSizes?.header || 24);
    doc.setFont('helvetica', 'bold');
    const nameWidth = doc.getTextWidth(data.fullName);
    doc.text(data.fullName, (pageWidth - nameWidth) / 2, yPosition);
    yPosition += 6;

    doc.setFontSize((data.fontSizes?.header || 24) * 0.6);
    doc.setFont('helvetica', 'normal');
    const titleWidth = doc.getTextWidth(data.jobTitle);
    doc.text(data.jobTitle, (pageWidth - titleWidth) / 2, yPosition);
    yPosition += 8;

    addLine();

    // === CONTACT INFO ===
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const contactInfo = `${data.linkedin.replace(/^https?:\/\//, '')} | ${data.email}${data.atHandle ? ` | ${data.atHandle}` : ''}`;
    const contactWidth = doc.getTextWidth(contactInfo);
    doc.text(contactInfo, (pageWidth - contactWidth) / 2, yPosition);
    yPosition += 8;

    addLine();

    // === PROFESSIONAL SUMMARY ===
    checkPageBreak(20);
    doc.setFontSize(data.fontSizes?.body || 12.5);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(data.summary, contentWidth);
    summaryLines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin, yPosition);
        yPosition += 5;
    });
    yPosition += 3;

    // === AREAS OF EXPERTISE ===
    addSectionHeader('Areas of Expertise');
    const skills = data.skills.split(',').map(s => s.trim());
    const midPoint = Math.ceil(skills.length / 2);
    const col1 = skills.slice(0, midPoint);
    const col2 = skills.slice(midPoint);

    doc.setFontSize(data.fontSizes?.body || 12.5);
    doc.setFont('helvetica', 'normal');

    const maxRows = Math.max(col1.length, col2.length);
    for (let i = 0; i < maxRows; i++) {
        checkPageBreak(6);
        if (col1[i]) {
            doc.text('•', margin + 2, yPosition);
            doc.text(col1[i], margin + 6, yPosition);
        }
        if (col2[i]) {
            doc.text('•', margin + (contentWidth / 2) + 2, yPosition);
            doc.text(col2[i], margin + (contentWidth / 2) + 6, yPosition);
        }
        yPosition += 5;
    }
    yPosition += 3;

    // === KEY ACHIEVEMENTS ===
    if (data.keyAchievements) {
        addSectionHeader('Key Achievement');
        const achievements = data.keyAchievements.split('\n').filter(line => line.trim());
        doc.setFontSize(data.fontSizes?.body || 12.5);
        doc.setFont('helvetica', 'normal');

        achievements.forEach(achievement => {
            checkPageBreak(8);
            const cleanAchievement = achievement.replace(/^[•-]\s*/, '');
            const lines = doc.splitTextToSize(cleanAchievement, contentWidth - 6);

            lines.forEach((line: string, idx: number) => {
                if (idx === 0) {
                    doc.text('•', margin + 2, yPosition);
                    doc.text(line, margin + 6, yPosition);
                } else {
                    checkPageBreak(5);
                    doc.text(line, margin + 6, yPosition);
                }
                yPosition += 5;
            });
            yPosition += 1;
        });
        yPosition += 2;
    }

    // === PROFESSIONAL EXPERIENCE ===
    addSectionHeader('Professional Experience');

    data.experience.forEach((exp, index) => {
        checkPageBreak(25);

        // Role and Company on same line
        doc.setFontSize(data.fontSizes?.body || 12.5);
        doc.setFont('helvetica', 'bold');
        const roleText = `${exp.role} - `;
        const roleWidth = doc.getTextWidth(roleText);
        doc.text(roleText, margin, yPosition);

        doc.setFont('helvetica', 'italic');
        doc.text(exp.company, margin + roleWidth, yPosition);

        // Date on the right
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        const dateText = `${formatMonthYear(exp.startDate)} - ${formatMonthYear(exp.endDate)}`;
        const dateWidth = doc.getTextWidth(dateText);
        doc.text(dateText, pageWidth - margin - dateWidth, yPosition);
        yPosition += 6;

        // Responsibilities
        doc.setFontSize(data.fontSizes?.body || 12.5);
        doc.setFont('helvetica', 'normal');
        const responsibilities = descriptionToString(exp.description).split('\n').filter(line => line.trim());

        responsibilities.forEach(resp => {
            checkPageBreak(8);
            const cleanResp = resp.replace(/^[•-]\s*/, '');
            const lines = doc.splitTextToSize(cleanResp, contentWidth - 6);

            lines.forEach((line: string, idx: number) => {
                if (idx === 0) {
                    doc.text('•', margin + 2, yPosition);
                    doc.text(line, margin + 6, yPosition);
                } else {
                    checkPageBreak(5);
                    doc.text(line, margin + 6, yPosition);
                }
                yPosition += 5;
            });
            yPosition += 1;
        });

        yPosition += 3;
    });

    // === EDUCATION ===
    addSectionHeader('Education');

    data.education.forEach(edu => {
        checkPageBreak(12);

        doc.setFontSize(data.fontSizes?.body || 12.5);
        doc.setFont('helvetica', 'bold');
        doc.text(edu.degree, margin, yPosition);

        // Year on the right
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        const yearWidth = doc.getTextWidth(edu.year);
        doc.text(edu.year, pageWidth - margin - yearWidth, yPosition);
        yPosition += 5;

        doc.setFontSize(data.fontSizes?.body || 12.5);
        doc.setFont('helvetica', 'italic');
        doc.text(edu.school, margin, yPosition);
        yPosition += 8;
    });

    // === CERTIFICATION ===
    if (data.certifications) {
        addSectionHeader('Certification');
        doc.setFontSize(data.fontSizes?.body || 12.5);
        doc.setFont('helvetica', 'normal');
        const certLines = doc.splitTextToSize(data.certifications, contentWidth - 6);
        certLines.forEach((line: string, idx: number) => {
            if (idx === 0) {
                doc.text('•', margin + 2, yPosition);
                doc.text(line, margin + 6, yPosition);
            } else {
                checkPageBreak(5);
                doc.text(line, margin + 6, yPosition);
            }
            yPosition += 5;
        });
    }

    // Save the PDF
    doc.save(`${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
};

// Helper function to format dates
const formatMonthYear = (dateString: string): string => {
    if (!dateString || dateString.toLowerCase() === 'present') {
        return 'Present';
    }
    try {
        const [year, month] = dateString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
};
