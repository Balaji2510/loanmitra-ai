// Vercel Serverless Function: /api/assistant
// LoanMitra AI Copilot - Bilingual (Tamil, English, Tanglish) Conversational Assistant

export default async function handler(req, res) {
  // CORS & Method verification
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
    const { message, conversationHistory = [], language = 'en', context = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid "message" string is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Grounding system prompt for fintech advisory
    const systemInstruction = `You are "LoanMitra AI Copilot", an elite fintech loan advisory assistant for Indian financial advisors and loan agencies.
Language Support: You are fully trilingual in Tamil (தமிழ்), English, and Tanglish (Tamil written in English script).
Response Language Rule: If the user communicates in Tamil, respond in fluent, professional Tamil. If in Tanglish, respond in friendly Tanglish. If in English, respond in crisp, professional English.

CRITICAL FINANCIAL GUARDRAILS:
1. Never guarantee loan approval. All assessments are preliminary and subject to official lender underwriting and verification.
2. Never invent interest rates or loan policies. Refer to typical verified benchmark rates (e.g., Home Loans ~8.4%-9.5%, Personal Loans ~10.5%-16%, Business Loans ~13%-18%) and instruct the advisor to check exact lender rate cards.
3. Calculate FOIR (Fixed Obligation to Income Ratio) accurately: Ideal FOIR is 40% to 50% for personal loans, up to 55%-60% for secured home loans.
4. When asked to generate customer messages or reminders, craft ready-to-send polite WhatsApp/SMS templates in the requested language (Tamil/Tanglish/English) with clear document checklists.

Advisor Context Available:
- Current City / Focus: Tamil Nadu / Indian Metros & Tier-2
- Top Partner Lenders: HDFC Bank, SBI, ICICI Bank, Axis Bank, Bajaj Finserv, Tata Capital, Muthoot Finance.
- User Role: Loan Advisor`;

    // If Gemini API Key is configured, make real call to Gemini API
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      const contents = [
        ...conversationHistory.slice(-6).map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        {
          role: 'user',
          parts: [{ text: `${message}\n\nContext: ${JSON.stringify(context || {})}` }],
        },
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', errorText);
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

      return res.status(200).json({
        reply,
        provider: 'gemini-1.5-flash',
        language,
        timestamp: new Date().toISOString(),
      });
    }

    // High-Fidelity Intelligent Deterministic Fallback if API Key not yet supplied
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
    } else if (lower.includes('reminder') || lower.includes('document reminder') || lower.includes('message in tamil')) {
      reply = `இதோ வாடிக்கையாளருக்கு அனுப்பக்கூடிய WhatsApp/SMS செய்தி மாதிரி:

"வணக்கம் திரு/திருமதி [பெயர்],
LoanMitra மூலம் விண்ணப்பித்துள்ள உங்கள் வீட்டுக் கடன் செயலாக்கத்திற்கு (SBI Home Loan) கீழ்க்கண்ட ஆவணங்கள் இன்னும் நிலுவையில் உள்ளன:
1. கடந்த 6 மாத வங்கி கணக்கு அறிக்கை (Bank Statement)
2. சொத்து விற்பனை ஒப்பந்த நகல் (Sale Agreement Copy)

கடன் ஒப்புதலை விரைவுபடுத்த தயவுசெய்து இவற்றை இன்றே அனுப்பி உதவவும். 
நன்றி!
- LoanMitra AI Team"`;
    } else if (lower.includes('emi') || lower.includes('calculate')) {
      reply = `₹5,00,000 கடனுக்கான 12% வட்டியில் உத்தேச EMI விவரங்கள்:

• **3 ஆண்டுகள் (36 மாதங்கள்)**: மாத EMI = ₹16,607 (மொத்த வட்டி: ₹97,858)
• **4 ஆண்டுகள் (48 மாதங்கள்)**: மாத EMI = ₹13,167 (மொத்த வட்டி: ₹1,32,010)
• **5 ஆண்டுகள் (60 மாதங்கள்)**: மாத EMI = ₹11,122 (மொத்த வட்டி: ₹1,67,333)

*உங்கள் வாடிக்கையாளரின் மாத நிகர வருமானம் மற்றும் FOIR கணக்கீட்டின்படி tenure-ஐ தேர்வு செய்யவும்.*`;
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
