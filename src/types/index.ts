export interface HistoricalEvent {
  id: string;
  title: string;
  content: string;
  category: NewsCategoryType;
  imagePrompt?: string;
  imageUrl?: string;
  additionalContext?: string;
  byline?: string;
  sources?: string;
  historicalContext?: string;
}

export type NewsCategoryType = 'politics' | 'international' | 'local' | 'entertainment' | 'sports' | 'weather' | 'business' | 'technology' | 'science';

export interface CategoryDefinition {
  id: NewsCategoryType;
  name: string;
  description: string;
}

export interface WeatherData {
  temperature: string;
  conditions: string;
  description: string;
}

export interface GeminiApiResponse {
  text: string;
  events: HistoricalEvent[];
  weather?: WeatherData;
}

export interface ContextRequest {
  topic: string;
  historicalDate: Date;
}

export interface VideoGenerationRequest {
  prompt: string;
  eventTitle: string;
}
