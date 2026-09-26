import { ResumeData, TemplateType } from '../../types';
import { exportResumeToPdf, printResumeToPdf, exportResumeToPlainText, downloadFile } from '../../utils/pdfExport';
import { exportResumeToDocx } from '../../utils/docxExport';

export const generatePDF = async (data: ResumeData, template: TemplateType = 'vanguard', filename?: string) => {
  return exportResumeToPdf(data, template, filename);
};

export const generateDocx = async (data: ResumeData, filename?: string) => {
  return exportResumeToDocx(data, filename);
};

export { printResumeToPdf, exportResumeToPlainText, downloadFile, exportResumeToDocx };

