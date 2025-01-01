import { extractJSONFromMarkdown } from './markdownParser';
import type { CreditCardRecommendation } from '../types';

interface ParsedResponse {
  recommendations: CreditCardRecommendation[];
}

export function parseOpenAIResponse(content: string): ParsedResponse {
  try {
    console.log('Raw OpenAI response:', content);
    
    // Extract JSON from markdown if needed
    const jsonContent = extractJSONFromMarkdown(content);
    console.log('Extracted JSON content:', jsonContent);
    
    // Parse the JSON content
    const parsed = JSON.parse(jsonContent);
    console.log('Parsed content:', parsed);

    // Handle different response formats
    let recommendation: CreditCardRecommendation;

    if (parsed.card_name) {
      // Direct card format
      recommendation = {
        card_name: parsed.card_name,
        annual_fee: parsed.annual_fee || 'N/A',
        maximum_value_of_benefits: parsed.maximum_value_of_benefits || 'N/A',
        real_world_benefits: parsed.real_world_benefits || 'No benefits information available',
        card_image: parsed.card_image || 'https://via.placeholder.com/300x200?text=Credit+Card',
        apply_link: parsed.apply_link || '#'
      };
    } else if (parsed.CreditCards?.[0]) {
      // Array format
      const card = parsed.CreditCards[0];
      recommendation = {
        card_name: card.CreditCardName,
        annual_fee: card.AnnualFee,
        maximum_value_of_benefits: card.MaximumAnnualRewards,
        real_world_benefits: Array.isArray(card.RealWorldBenefits) 
          ? card.RealWorldBenefits.join(', ')
          : card.RealWorldBenefits,
        card_image: card.CardImageURL,
        apply_link: card.ApplyLink
      };
    } else {
      throw new Error('Invalid response format');
    }
    
    return { recommendations: [recommendation] };
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Failed to parse recommendation data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}