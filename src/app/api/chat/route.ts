import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Get the user from Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Count user messages to navigate the funnel
    const userMessageCount = messages.filter((m: any) => m.role === 'user').length;
    
    // Intake phase lasts for first 3 user messages (Initial request + 2 followups)
    const isRoutingPhase = userMessageCount >= 3;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY in environment variables");
    }

    let systemPrompt = '';

    if (isRoutingPhase) {
      // PHASE 2: ROUTING
      systemPrompt = `You are an AI symptom-to-specialist router for patients in India.
Your goal is to analyze the user's symptoms and history from the conversation, and provide a clear, structured recommendation.

Use Markdown formatting. Include:
## 👨‍⚕️ Specialist to Consult
(e.g., General Physician, Cardiologist, Gastroenterologist). Explain why.

## 🩸 Suggested Preliminary Tests 
(Only standard universally safe tests like CBC, Fasting Blood Sugar, Thyroid, ECG. Keep it simple and relevant).

## ⚠️ What NOT to do 
(Red flags, dangerous self-medication, warning signs).

**NO MEDICAL DIAGNOSIS. Give routing guidance only.** Add a clear disclaimer at the bottom that this is not medical advice and a doctor should be consulted.`;
    } else {
      // PHASE 1: INTAKE
      systemPrompt = `You are an empathetic, rapid healthcare intake assistant for an Indian audience.
Given the user's symptoms, ask 1 or 2 focused follow-up questions to understand:
- Duration of symptoms
- Severity
- Relevant medical history

Keep your response extremely concise (under 40 words). Be polite. Do not diagnose. Do not give medical advice. Simply ask the clarifying questions.`;
    }

    const { text: resultMessage } = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages,
      temperature: isRoutingPhase ? 0.2 : 0.5,
      maxTokens: isRoutingPhase ? 1024 : 256,
    });

    // Save message to database if conversation exists
    if (conversationId) {
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage?.role === 'user') {
        // Save user message
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            user_id: user.id,
            role: 'user',
            content: lastUserMessage.content,
          });

        // Save assistant message
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            user_id: user.id,
            role: 'assistant',
            content: resultMessage,
          });
      }
    }

    return NextResponse.json({
      role: 'assistant',
      content: resultMessage,
      isFinal: isRoutingPhase
    });

  } catch (error: any) {
    console.error("[v0] API Error:", error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
