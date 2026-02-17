import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock',
});

const MOCK_ROADMAP = {
  weeks: [
    {
      week: 1,
      title: 'Foundation & Core Concepts',
      topics: ['Review basics of missing areas', 'Set up learning environment', 'Daily practice routine'],
      practice: '30 min daily coding + 1 small project',
    },
    {
      week: 2,
      title: 'Deep Dive into Key Skills',
      topics: ['Structured learning for top 2 missing skills', 'Hands-on exercises', 'Document your progress'],
      practice: 'Build a mini project using new concepts',
    },
    {
      week: 3,
      title: 'Integration & Projects',
      topics: ['Combine skills in a single project', 'Code review mindset', 'Debugging and testing'],
      practice: 'Complete one portfolio project',
    },
    {
      week: 4,
      title: 'Advanced Topics & Polish',
      topics: ['Tackle remaining gaps', 'Best practices and patterns', 'Prepare for interviews'],
      practice: 'Mock interviews and refine resume',
    },
    {
      week: 5,
      title: 'Portfolio & Interview Prep',
      topics: ['Finalize projects', 'System design basics', 'Behavioral preparation'],
      practice: 'Apply to 5 roles and get feedback',
    },
    {
      week: 6,
      title: 'Launch',
      topics: ['Confidence building', 'Continuous learning plan', 'Networking'],
      practice: 'Keep applying and iterating on feedback',
    },
  ],
  generatedWithMock: true,
};

export async function generateRoadmap(userSkills, careerGoal, missingSkills) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'mock') {
    return buildMockRoadmap(missingSkills, careerGoal);
  }

  try {
    const prompt = buildPrompt(userSkills, careerGoal, missingSkills);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a career coach. Return ONLY valid JSON with this exact structure: { "weeks": [ { "week": 1, "title": "string", "topics": ["string"], "practice": "string" } ] }. No markdown, no extra text. 4-6 weeks.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content?.trim() || '{}';
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed.weeks) && parsed.weeks.length > 0) {
      return { weeks: parsed.weeks, generatedWithMock: false };
    }
  } catch (err) {
    console.warn('OpenAI error, using mock:', err.message);
  }
  return buildMockRoadmap(missingSkills, careerGoal);
}

function buildPrompt(userSkills, careerGoal, missingSkills) {
  return `Career goal: ${careerGoal}.
Current skills: ${userSkills.join(', ') || 'None'}.
Missing skills to become job-ready: ${missingSkills.join(', ') || 'None'}.
Generate a 4-6 week weekly learning roadmap (realistic for a student). Each week: title, 3-4 topics, and one practice suggestion. Return only the JSON object.`;
}

function buildMockRoadmap(missingSkills, careerGoal) {
  const base = { ...MOCK_ROADMAP };
  if (missingSkills.length > 0) {
    base.weeks[1].topics = [
      `Focus on: ${missingSkills.slice(0, 3).join(', ')}`,
      'Structured learning and hands-on exercises',
      'Document your progress',
    ];
  }
  base.weeks[0].topics[0] =
    missingSkills.length > 0
      ? `Basics of: ${missingSkills.slice(0, 2).join(', ')}`
      : 'Strengthen existing skills and industry best practices';
  return base;
}
