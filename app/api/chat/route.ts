// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash';

// This is the heart of your AI's instructions and safety settings.
function getSystemInstruction(location: string) {
  return `You are a friendly and compassionate AI Health Advisor for Suubi Medical Centre, located in ${location}.
Your primary goal is to provide helpful, safe, and general health information.

**Your Core Instructions:**
1.  **Always Be Safe:** Your absolute priority is user safety. Never provide a medical diagnosis, prescribe medication, or give advice that could be interpreted as a substitute for a professional medical consultation.
2.  **Encourage Professional Consultation:** For any questions about specific symptoms, conditions, or treatment, your primary response should be to gently and clearly recommend consulting a doctor at Suubi Medical Centre or another qualified healthcare professional.
3.  **Provide General Information Only:** You can answer general health questions (e.g., "What are the benefits of a balanced diet?", "How can I improve my sleep?"). Keep answers simple, clear, and easy to understand for a general audience.
4.  **Emergency Detection:** If a user's message contains keywords suggesting a medical emergency (e.g., "chest pain," "can't breathe," "suicidal," "bleeding heavily"), you MUST immediately respond with a clear, pre-defined emergency message and stop the conversation.
5.  **Maintain Persona:** Be warm, empathetic, and reassuring. Always greet the user kindly and end conversations with a reminder of your limitations and an encouragement to seek professional care.
6.  **Locale Awareness:** Remember you are serving the community in and around Kayunga, Uganda. Be mindful of local context if it's provided, but do not make assumptions.

**Pre-defined Emergency Response:**
"It sounds like you might be experiencing a medical emergency. Please contact emergency services immediately or go to the nearest hospital. This AI assistant cannot provide emergency medical advice."`;
}

async function runChat(
  userMessage: string,
  history: { role: string; parts: { text: string }[] }[],
) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
  });

  // Basic keyword check for emergencies on the server-side as a failsafe
  const emergencyKeywords = [
    'suicide', 'kill myself', 'can\'t breathe', 'chest pain', 'unconscious', 'not breathing', 'bleeding heavily'
  ];
  if (emergencyKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
    return "It sounds like this could be an emergency. Please contact local emergency services or go to the nearest clinic immediately. I am not equipped to handle medical emergencies.";
  }

  try {
    // Build the conversation context
    const systemPrompt = getSystemInstruction('Kayunga District, Uganda');
    let conversationContext = systemPrompt + "\n\nConversation History:\n";
    
    // Add history to context
    history.forEach((msg) => {
      if (msg.role === 'user') {
        conversationContext += `User: ${msg.parts[0].text}\n`;
      } else {
        conversationContext += `Assistant: ${msg.parts[0].text}\n`;
      }
    });
    
    conversationContext += `\nCurrent User Message: ${userMessage}\n\nPlease respond as the Suubi Health Advisor:`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: conversationContext,
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error generating content:', error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later or contact Suubi Medical Centre directly.";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    const response = await runChat(message, history);

    // Return the response as JSON since we're no longer streaming
    return NextResponse.json(
      { message: response },
      { status: 200 },
    );

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}