import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Generate AI-powered insights for a given user profile and recommendation.
 *
 * This function is completely isolated from the recommendation engine.
 * It only enhances the display — the recommendation is already final.
 *
 * @param {{ fullName: string, qualification: string, experience: number, profession: string, careerGoal: string, recommendation: string }} params
 * @returns {Promise<string|null>} Markdown-formatted insights or null on failure
 */
export async function generateAIInsights({
  fullName,
  qualification,
  experience,
  profession,
  careerGoal,
  recommendation,
}) {
  if (!genAI) {
    console.warn('Gemini API key not configured — skipping AI insights.');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an academic career advisor. A user has received a pathway recommendation from a rules-based engine. Your job is ONLY to provide supporting insights — do NOT change or question the recommendation.

User Profile:
- Name: ${fullName}
- Highest Qualification: ${qualification}
- Years of Experience: ${experience}
- Current Profession: ${profession}
- Career Goal: ${careerGoal}

Final Recommendation (already decided, do not change): ${recommendation}

Generate the following sections in markdown format. Keep the total response under 180 words. Be professional, encouraging, practical, and personalized. Avoid generic motivational statements, exaggerated praise, unrealistic claims, or overly academic language.

## Why This Recommendation Fits You
Provide 2–3 concise sentences explaining why "${recommendation}" aligns with this user's profile.

## Suggested Next Steps
Provide exactly 3 actionable, specific, and relevant bullet points.

## Skills to Focus On
Provide 3–5 practical, career-oriented skills relevant to the "${recommendation}" pathway.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      console.warn('Gemini returned empty response.');
      return null;
    }

    return text.trim();
  } catch (error) {
    console.error('Gemini AI insights generation failed:', error);
    return null;
  }
}
