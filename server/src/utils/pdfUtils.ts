import { readFileSync } from 'fs';
import pdf from 'pdf-parse';

interface SuccessfulPdfParse {
  success: true,
  text: string
}

interface UnSuccessfulPdfParse {
  success: false,
  text?: undefined
}
type PdfParse = SuccessfulPdfParse | UnSuccessfulPdfParse;
// using some cool typescript properties

export async function extractTextFromPDF(pdfPath: string): Promise<PdfParse> {
  try {
    const dataBuffer = readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return {success: true, text: data.text};  
    // by the value of success, ts can realize whether it's the successful or unsuccessful type
  } catch (err: any) {
    console.error("Error extracting PDF text:", err.message);
    return {success: false};
  }
}