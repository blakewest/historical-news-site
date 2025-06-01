export const API_CONFIG = {
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  GEMINI_VEO_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-veo:generateContent',
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
You are a historical researcher tasked with creating newspaper content about events that happened exactly 100 years ago on {date}. 
Please research and provide authentic historical events from that specific date, formatted as a JSON object with the following structure:

{
  "events": [
    {
      "id": "unique-id-1",
      "title": "Headline title in newspaper style",
      "content": "Full article content in modern vernacular, minimum 150 words",
      "category": "one of: politics, international, local, entertainment, sports, business, science, or weather",
      "imagePrompt": "Detailed prompt that would generate an image of this historical event or person",
      "byline": "Reporter Name, Historical Times Staff"
    },
    // More events...
  ],
  "weather": {
    "temperature": "Temperature in Fahrenheit",
    "conditions": "Short description (e.g., Sunny, Rainy)",
    "description": "Brief weather report for New York City on that day"
  }
}

Important guidelines:
1. Include at least 1 major story for each category (politics, international, local, entertainment, sports, business)
2. Ensure all events ACTUALLY occurred on {date} exactly 100 years ago
3. Write in authentic 1920s newspaper style for headlines, but modern language for content
4. Include real names of people, places and specific details from the historical events
5. Make sure image prompts are detailed enough to generate realistic historical images
6. Provide believable reporter names for the bylines
7. For weather, research or estimate the likely conditions in New York City on that date

Your response should ONLY be the valid JSON object with no additional text.
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