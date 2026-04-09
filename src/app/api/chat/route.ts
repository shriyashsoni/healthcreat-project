import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Count user messages to navigate the funnel
    const userMessageCount = messages.filter((m: any) => m.role === 'user').length;
    
    // Intake phase lasts for first 3 user messages (Initial request + 2 followups)
    const isRoutingPhase = userMessageCount >= 3;

    if (!process.env.NVIDIA_LLAMA_8B_API_KEY || !process.env.NVIDIA_NEMOTRON_70B_API_KEY) {
      throw new Error("Missing NVIDIA API Keys in .env.local file");
    }

    let completion;

    if (isRoutingPhase) {
      // ----------------------------------------------------
      // PHASE 2: ROUTING (nvidia/llama-3.1-nemotron-70b-instruct)
      // ----------------------------------------------------
      const client = new OpenAI({
        apiKey: process.env.NVIDIA_NEMOTRON_70B_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
      });

      const systemPrompt = {
        role: "system",
        content: `You are an AI symptom-to-specialist router for patients in India.
Your goal is to analyze the user's symptoms and history from the conversation, and provide a clear, structured recommendation.

Use Markdown formatting. Include:
## 👨‍⚕️ Specialist to Consult
(e.g., General Physician, Cardiologist, Gastroenterologist). Explain why.

## 🩸 Suggested Preliminary Tests 
(Only standard universally safe tests like CBC, Fasting Blood Sugar, Thyroid, ECG. Keep it simple and relevant).

## ⚠️ What NOT to do 
(Red flags, dangerous self-medication, warning signs).

**NO MEDICAL DIAGNOSIS. Give routing guidance only.** Add a clear disclaimer at the bottom that this is not medical advice and a doctor should be consulted.`
      };

      completion = await client.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-70b-instruct",
        messages: [systemPrompt, ...messages],
        temperature: 0.2, // Low temp for more clinical logic/consistency
        max_tokens: 1024,
      });

    } else {
      // ----------------------------------------------------
      // PHASE 1: INTAKE (meta/llama-3.1-8b-instruct)
      // ----------------------------------------------------
      const client = new OpenAI({
        apiKey: process.env.NVIDIA_LLAMA_8B_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
      });

      const systemPrompt = {
        role: "system",
        content: `You are an empathetic, rapid healthcare intake assistant for an Indian audience.
Given the user's symptoms, ask 1 or 2 focused follow-up questions to understand:
- Duration of symptoms
- Severity
- Relevant medical history

Keep your response extremely concise (under 40 words). Be polite. Do not diagnose. Do not give medical advice. Simply ask the clarifying questions.`
      };

      completion = await client.chat.completions.create({
        model: "meta/llama-3.1-8b-instruct",
        messages: [systemPrompt, ...messages],
        temperature: 0.5,
        max_tokens: 256,
      });
    }

    const resultMessage = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      role: 'assistant',
      content: resultMessage,
      isFinal: isRoutingPhase // Used by frontend to show we've reached the end
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
