export function extractJSONFromMarkdown(content: string): string {
  // If content contains markdown code blocks
  if (content.includes('```')) {
    // Try to find JSON block
    const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch?.[1]) {
      return jsonMatch[1].trim();
    }
  }

  // Try to find content between card details section
  const cardDetailsMatch = content.match(/### Card Details\n([\s\S]*?)(?:\n###|$)/);
  if (cardDetailsMatch?.[1]) {
    // Convert bullet points to JSON
    const lines = cardDetailsMatch[1].split('\n').filter(Boolean);
    const jsonObj: Record<string, string> = {};
    
    lines.forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value) {
        const cleanKey = key.replace(/^[*-]\s*\*\*|\*\*$/g, '').toLowerCase().replace(/\s+/g, '_');
        jsonObj[cleanKey] = value;
      }
    });
    
    return JSON.stringify(jsonObj);
  }

  // Return original content if no markdown patterns found
  return content;
}