import { openai } from './client';
import { generateSystemPrompt, generateUserPrompt } from './prompts';
import { parseOpenAIResponse } from './parsers/responseParser';
import type { UserProfile } from '../../types/profile';
import type { RecommendationsResponse } from './types';

export async function getRecommendations(profile: UserProfile): Promise<RecommendationsResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: generateSystemPrompt() },
        { role: "user", content: generateUserPrompt(profile) }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No recommendations received from OpenAI');
    }

    console.log('OpenAI Response:', content);
    return parseOpenAIResponse(content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}