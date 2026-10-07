import { ResumeData, TemplateType } from '../../types';
import { exportResumeToServerPdf, printResumeToPdf, exportResumeToPlainText, downloadFile } from '../../utils/pdfExport';
import { exportResumeToDocx } from '../../utils/docxExport';

/**
 * Generate the resume PDF via the server-side vector pipeline (headless Chromium).
 * Throws a human-readable Error on failure — callers own the fallback UX.
 */
export const generatePDF = async (data: ResumeData, template: TemplateType = 'vanguard', filename?: string) => {
  return exportResumeToServerPdf(data, template, filename);
};

export const generateDocx = async (data: ResumeData, filename?: string, template?: TemplateType) => {
  return exportResumeToDocx(data, filename, template);
};

export { printResumeToPdf, exportResumeToPlainText, downloadFile, exportResumeToDocx };

