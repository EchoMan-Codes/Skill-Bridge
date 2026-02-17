import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'mock' });

const SYSTEM_PROMPT = `You are SkillBridge's career assistant. You help students with:
- Skill gap and career roadmap questions
- Explaining job roles (Software Developer, Data Analyst, ML Engineer, Web Developer, Full Stack, DevOps, Cloud, Product Manager, etc.)
- Learning advice and which skills to prioritize
- How to use the platform (assessment, dashboard, roadmap)
Keep answers concise, friendly, and actionable. If you don't have an API key, say you're in demo mode and suggest trying the assessment.`;

export async function postChat(req, res) {
  try {
    const { messages = [] } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'mock') {
      return res.json({
        reply: "I'm in demo mode right now (no API key). Try the skill assessment and roadmap — they work! For full AI answers, add OPENAI_API_KEY to the backend.",
        role: 'assistant',
      });
    }
    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-20).map((m) => ({ role: m.role || 'user', content: m.content || '' })),
    ];
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      temperature: 0.7,
    });
    const reply = completion.choices[0]?.message?.content?.trim() || "I couldn't generate a reply.";
    res.json({ reply, role: 'assistant' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Chat failed' });
  }
}
