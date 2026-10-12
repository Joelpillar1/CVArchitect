import { ResumeData, TemplateType } from '../../types';
import { exportResumeToServerPdf, exportResumeToPdf, printResumeToPdf, exportResumeToPlainText, downloadFile } from '../../utils/pdfExport';
import { exportResumeToDocx } from '../../utils/docxExport';

/**
 * Generate the resume PDF via the server-side vector pipeline (headless Chromium),
 * with automatic high-resolution client-side canvas fallback if the server request
 * drops, times out, or fails.
 */
export const generatePDF = async (data: ResumeData, template: TemplateType = 'vanguard', filename?: string) => {
  return exportResumeToServerPdf(data, template, filename);
};

export const generateDocx = async (data: ResumeData, filename?: string, template?: TemplateType) => {
  return exportResumeToDocx(data, filename, template);
};

export { exportResumeToServerPdf, exportResumeToPdf, printResumeToPdf, exportResumeToPlainText, downloadFile, exportResumeToDocx };
