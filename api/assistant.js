// Vercel Serverless Function: /api/assistant
// LoanMitra AI Copilot - Bilingual (Tamil, English, Tanglish) Conversational Assistant

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const { message, conversationHistory = [], language = 'en', context = {} } = body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid "message" string is required.' });
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');

    const systemInstruction = `You are "LoanMitra AI Copilot", an elite fintech loan advisory assistant designed for Indian loan advisors and DSAs.
Language Support: You are fully trilingual in Tamil (தமிழ்), English, and Tanglish (Tamil written in English script).
Response Language Rule:
- If the user communicates in Tamil, respond in fluent, natural, professional Tamil.
- If the user writes in Tanglish, respond in warm, natural Tanglish.
- If in English, respond in crisp, professional English.

CRITICAL FINANCIAL GUARDRAILS:
1. Never guarantee loan approval. All assessments are preliminary and subject to official lender underwriting and document verification.
2. Ground interest rates in typical benchmark ranges:
   - Home Loans: ~8.4% - 9.5% (SBI, HDFC)
   - Personal Loans: ~10.5% - 16% (HDFC, ICICI, Bajaj)
   - Business Loans: ~13% - 18% (ICICI, NBFCs)
   - Gold Loans: ~9.9% - 16% (Muthoot Finance)
3. Calculate FOIR (Fixed Obligation to Income Ratio) accurately: Standard FOIR benchmark is 50% for personal loans, up to 55%-60% for home loans.
4. When asked to draft WhatsApp/SMS reminder templates, write polite, ready-to-send messages with clear document lists in the requested language.`;

    // Verified model list: gemini-3.5-flash is primary
    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      const contents = [
        ...conversationHistory.slice(-6).map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user',
          parts: [{ text: `${message}\n\n[Context: Advisor Workspace, Preferred Language: ${language}, Context: ${JSON.stringify(context || {})}]` }],
        },
      ];

      for (const model of modelsToTry) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents,
                systemInstruction: {
                  parts: [{ text: systemInstruction }],
                },
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 1200,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              return res.status(200).json({
                reply,
                provider: model,
                language,
                timestamp: new Date().toISOString(),
              });
            }
          }
        } catch (fetchErr) {
          console.error(`Fetch error for ${model}:`, fetchErr);
        }
      }
    }

    // High-Fidelity Fallback if API key missing or rate-limited
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('personal loan') || lower.includes('5 lakh') || lower.includes('5 லட்சம்') || lower.includes('கிடைக்குமா')) {
      reply = `வணக்கம்! 5 லட்சம் Personal Loan பெறுவதற்கான வழிகாட்டுதல்:

1. **வருமான தகுதி (Income Eligibility)**: மாத சம்பளம் குறைந்தபட்சம் ₹25,000 முதல் ₹35,000 இருக்க வேண்டும்.
2. **தற்போதைய EMI (FOIR Rule)**: உங்கள் மொத்த EMI தொகை மாத வருமானத்தில் 50%-க்கு மேல் போகக்கூடாது.
3. **CIBIL Score**: 720+ இருந்தால் HDFC (10.5%), SBI, ICICI போன்ற வங்கிகளில் குறைந்த வட்டியில் கிடைக்கும்.
4. **தேவையான ஆவணங்கள்**:
   - கடந்த 3 மாத Payslips
   - 6 மாத Bank Statement
   - PAN & Aadhaar Card
   - Form 16 / ITR

*குறிப்பு: இது உத்தேச தகுதி மட்டுமே. வங்கியின் இறுதி ஒப்புதலுக்கு ஆவண சரிபார்ப்பு அவசியம்.*`;
    } else if (lower.includes('reminder') || lower.includes('document reminder') || lower.includes('message in tamil') || lower.includes('whatsapp')) {
      reply = `இதோ வாடிக்கையாளருக்கு அனுப்பக்கூடிய WhatsApp/SMS செய்தி மாதிரி:

"வணக்கம் திரு/திருமதி [பெயர்],
LoanMitra மூலம் விண்ணப்பித்துள்ள உங்கள் வீட்டுக் கடன் செயலாக்கத்திற்கு (SBI Home Loan) கீழ்க்கண்ட ஆவணங்கள் இன்னும் நிலுவையில் உள்ளன:
1. கடந்த 6 மாத வங்கி கணக்கு அறிக்கை (Bank Statement)
2. சொத்து விற்பனை ஒப்பந்த நகல் (Sale Agreement Copy)

கடன் ஒப்புதலை விரைவுபடுத்த தயவுசெய்து இவற்றை இன்றே அனுப்பி உதவவும். 
நன்றி!
- LoanMitra AI Team"`;
    } else {
      reply = `Hello! I am your LoanMitra AI Copilot.
I can assist you with:
- Checking borrower eligibility and FOIR calculations
- Comparing policies across HDFC, SBI, ICICI, Axis, Bajaj, and Tata Capital
- Generating professional reminder messages in Tamil (தமிழ்), Tanglish, and English
- Creating document verification checklists

How can I help with your customer's loan application today?`;
    }

    return res.status(200).json({
      reply,
      provider: 'loanmitra-ai-engine',
      language,
      isDemoMode: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Assistant Handler Error:', error);
    return res.status(500).json({
      error: 'An error occurred while communicating with LoanMitra AI Copilot.',
      details: error.message,
    });
  }
}
