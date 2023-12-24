const { GoogleGenerativeAI,HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
require('dotenv').config();


const API_KEY= process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function runTexttoText(prompt) {
    const safetySettings = [
        {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
    ];
    const model = genAI.getGenerativeModel({ model: "gemini-pro",safetySettings});
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

function fileToGenerativePart(blob, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(blob).toString("base64"),
        mimeType
      },
    };
  }
  
  async function runImagetoText(prompt,blob) {

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const mimeType='image/jpeg';

    const imageParts = [
        fileToGenerativePart(blob, mimeType),
      ];
  
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
   return (text);
  }

  module.exports={
    runTexttoText,
    runImagetoText
  }