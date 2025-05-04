import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });

interface SuccessfulQuery {
  success: true,
  text: string
}

interface UnSuccessfulQuery {
  success: false,
  message: string // error message
}

type Query = SuccessfulQuery | UnSuccessfulQuery;

export async function queryEvaluateProposals(tender: string, proposals: string[]) {  // tender and proposals are the text of the documents
  const prompt = `You are an AI assistant for evaluating proposals. Your task is to analyze the following proposals and provide a score for each one.
  The first document is the tender document, and the rest are the proposals.
  ${tender}\n\n${proposals.map((proposal, index) => `Proposal ${index + 1}:\n${proposal}`).join('\n\n')}`;
  const result = await queryGemini(prompt); // we propagate the result monad higher, then handle it in the controller
  return result;
}

export async function extractScores(evaluations: string) {
  const result = await queryGemini(`Based on the evaluations, please parse json data for the subscores and final score of each proposal, put them in an array:\n${evaluations}`);
  if(!result.success)
    return result; // propagate up the function chain
  const parsedResult = JSON.parse(result.text.replace('```json', '').replace('```', ''));
  return parsedResult;
}

export async function queryGemini(prompt: string): Promise<Query> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return { success: true, text: response.text ?? '' };
  } catch (err: any) {
    // Properly format the error response
    const errorData = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err.message;
    return { success: false, message: `Gemini API error: ${errorData}` };
  }
}