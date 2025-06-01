export const API_CONFIG = {
  // The @google/genai SDK handles API endpoints internally, no URLs needed
  // In a production application, API keys should be handled securely through a backend
  // This is a placeholder and should be replaced with proper API key management
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
};

export const NEWS_CATEGORIES = [
  { id: 'politics', name: 'Politics', description: 'Political news and governmental affairs' },
  { id: 'international', name: 'International', description: 'World news and global events' },
  { id: 'local', name: 'Local', description: 'New York City news and events' },
  { id: 'entertainment', name: 'Arts & Entertainment', description: 'Culture, arts, and entertainment news' },
  { id: 'sports', name: 'Sports', description: 'Sports news and athletic achievements' },
  { id: 'business', name: 'Business', description: 'Business and financial news' },
  { id: 'science', name: 'Science', description: 'Scientific discoveries and advancements' },
  { id: 'weather', name: 'Weather', description: 'Weather forecasts and conditions' },
];

export const APP_TITLE = 'The Historical Times';

export const DEFAULT_IMAGE_URL = 'https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg';

export const GEMINI_PROMPT_TEMPLATE = `
You are an expert historical researcher with access to comprehensive newspaper archives and historical records. Your task is to research and report on authentic events that occurred exactly 100 years ago on {date}.

CONDUCT DEEP RESEARCH:
1. Search through historical newspaper archives from major publications like The New York Times, The Washington Post, Chicago Tribune, etc.
2. Cross-reference multiple sources to ensure accuracy
3. Focus on events that were actually reported in newspapers on or around {date}
4. Include specific details, quotes, and context from original reporting

Provide your findings as a JSON object with this structure:

{
  "events": [
    {
      "id": "unique-id-1",
      "title": "Authentic newspaper headline from {date}",
      "content": "Comprehensive article (200+ words) based on actual historical reporting, written in modern language but preserving historical facts and context",
      "category": "politics|international|local|entertainment|sports|business|science|weather",
      "imagePrompt": "Detailed, historically accurate prompt for generating a period-appropriate photograph or illustration",
      "byline": "Authentic-sounding reporter name, Historical Times Staff",
      "sources": "Brief mention of the type of historical sources (e.g., 'Based on reports from The New York Times and Associated Press')",
      "historicalContext": "2-3 sentences explaining why this event was significant in 1924"
    }
  ],
  "weather": {
    "temperature": "Researched or estimated temperature for NYC on {date}",
    "conditions": "Weather conditions based on historical records if available",
    "description": "Period-appropriate weather report for New York City"
  }
}

CRITICAL REQUIREMENTS:
1. ALL events must be historically accurate and verifiable
2. Include at least 6 diverse stories across different categories
3. Base content on actual newspaper reporting from the era
4. Image prompts should specify "black and white photograph, 1920s style" or "vintage newspaper illustration"
5. Include real historical figures, locations, and specific details
6. Ensure headlines capture the authentic style of 1920s journalism
7. Add historical context to help modern readers understand the significance

Return ONLY the JSON object with no additional text.
`;

export const ADDITIONAL_CONTEXT_TEMPLATE = `
You are a historical researcher providing additional context about {topic} as it existed on {date}, exactly 100 years ago. 

Important guidelines:
1. ONLY provide information that would have been known on {date} in 1924
2. Do NOT include any developments, knowledge, or perspectives from after {date}
3. Write in clear, modern language while maintaining historical accuracy
4. Focus on providing helpful context that expands understanding of the topic as it existed then
5. Include relevant details about the significance, background, and contemporary understanding of the topic
6. Your response should be concise (3-5 paragraphs) but informative

Remember, you are providing a snapshot of knowledge as it existed exactly 100 years ago on {date}.
`;
