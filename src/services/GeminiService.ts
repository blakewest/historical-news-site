import axios from 'axios';
import { API_CONFIG, GEMINI_PROMPT_TEMPLATE, ADDITIONAL_CONTEXT_TEMPLATE } from '../config/constants';
import { GeminiApiResponse, HistoricalEvent, ContextRequest, VideoGenerationRequest } from '../types';
import { formatHistoricalDate } from '../utils/dateUtils';

class GeminiService {
  private apiKey: string;

  constructor() {
    this.apiKey = API_CONFIG.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('Note: Gemini API key not found. Using mock data for development.');
    }
  }

  /**
   * Fetch historical events from 100 years ago
   */
  async fetchHistoricalEvents(historicalDate: Date): Promise<HistoricalEvent[]> {
    try {
      if (!this.apiKey) {
        return this.getMockData();
      }

      const formattedDate = formatHistoricalDate(historicalDate);
      const prompt = GEMINI_PROMPT_TEMPLATE.replace('{date}', formattedDate);
      
      const response = await axios.post(
        `${API_CONFIG.GEMINI_API_URL}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        }
      );

      // Parse the Gemini API response
      const content = response.data.candidates[0].content.parts[0].text;
      let parsedData: GeminiApiResponse;
      
      try {
        // Try to parse the JSON directly from the response
        parsedData = JSON.parse(content);
      } catch (e) {
        // If direct parsing fails, try to extract JSON from text
        const jsonMatch = content.match(/```json([\s\S]*?)```/) || 
                          content.match(/{[\s\S]*}/);
        
        if (jsonMatch) {
          const jsonStr = jsonMatch[0].replace(/```json|```/g, '').trim();
          parsedData = JSON.parse(jsonStr);
        } else {
          throw new Error('Failed to parse JSON from the API response');
        }
      }

      return parsedData.events;
    } catch (error) {
      console.error('Error fetching historical events:', error);
      return this.getMockData();
    }
  }

  /**
   * Get additional context about a specific topic from the historical period
   */
  async getAdditionalContext(request: ContextRequest): Promise<string> {
    try {
      if (!this.apiKey) {
        return "Additional historical context would appear here. Please add your Gemini API key to see real data.";
      }

      const formattedDate = formatHistoricalDate(request.historicalDate);
      const prompt = ADDITIONAL_CONTEXT_TEMPLATE
        .replace('{topic}', request.topic)
        .replace('{date}', formattedDate);
      
      const response = await axios.post(
        `${API_CONFIG.GEMINI_API_URL}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error fetching additional context:', error);
      return "Unable to retrieve additional context at this time.";
    }
  }

  /**
   * Generate a video based on a historical event
   */
  async generateVideo(request: VideoGenerationRequest): Promise<string> {
    try {
      if (!this.apiKey) {
        return "Video generation would appear here. Please add your Gemini API key to see real data.";
      }

      // This is a placeholder for the Gemini Veo API integration
      // In a real implementation, this would call the Veo API
      console.log('Video generation request:', request);
      
      // Mock response for now
      return "Video is being generated. This feature requires the Gemini Veo API which is not yet fully implemented.";
    } catch (error) {
      console.error('Error generating video:', error);
      return "Unable to generate video at this time.";
    }
  }

  /**
   * Generate mock data for development without an API key
   */
  private getMockData(): HistoricalEvent[] {
    return [
      {
        id: 'politics-1',
        title: 'PRESIDENT COOLIDGE SIGNS NEW IMMIGRATION ACT',
        content: "President Calvin Coolidge today signed the Immigration Act of 1924, dramatically restricting immigration into the United States. The new law establishes quotas based on national origin, significantly reducing immigration from Southern and Eastern Europe while completely excluding immigrants from Asia. Supporters argue the measure will preserve American culture and protect American workers, while critics contend it unfairly discriminates against certain nationalities. The legislation represents one of the most significant changes to U.S. immigration policy in the nation's history, effectively ending the era of mass immigration from Europe.",
        category: 'politics',
        imagePrompt: 'President Calvin Coolidge signing the Immigration Act of 1924 at his desk in the White House, black and white historical photograph',
        byline: 'Thomas Reynolds, Historical Times Staff',
      },
      {
        id: 'international-1',
        title: 'LENIN\'S DEATH PROMPTS POWER STRUGGLE IN SOVIET RUSSIA',
        content: "The recent death of Vladimir Lenin has thrown Soviet Russia into political uncertainty as a power struggle emerges among top Bolshevik leaders. Joseph Stalin has begun consolidating power as General Secretary of the Communist Party, while Leon Trotsky, once considered Lenin\'s natural successor, appears to be losing influence. Reports from Moscow suggest Stalin is forming alliances with other Politburo members Grigory Zinoviev and Lev Kamenev to isolate Trotsky. Western observers are watching closely as this internal conflict could determine the future direction of the world\'s first communist state, now entering its seventh year since the 1917 revolution.",
        category: 'international',
        imagePrompt: 'A solemn crowd gathered in Moscow\'s Red Square for Lenin\'s funeral in 1924, with Soviet flags and Bolshevik leaders visible, historical black and white photograph',
        byline: 'Frederick Williams, Foreign Correspondent',
      },
      {
        id: 'sports-1',
        title: 'OLYMPICS OPEN IN PARIS WITH GRAND CEREMONY',
        content: "The VIII Olympic Games commenced yesterday in Paris with an opening ceremony at the newly constructed Colombes Stadium. Nearly 3,000 athletes from 44 nations paraded before a capacity crowd of 45,000 spectators. The United States team, 299 strong, received warm applause as they marched past the reviewing stand. French organizing committee president Comte de Clary declared the games officially open, followed by the release of 10,000 pigeons symbolizing peace. These Olympics mark the first since the Great War, with Germany notably absent due to its exclusion following the conflict. Competition begins today with swimming and athletics events expected to draw the largest crowds.",
        category: 'sports',
        imagePrompt: 'The opening ceremony of the 1924 Paris Olympics at Colombes Stadium with athletes parading with national flags, black and white historical photograph',
        byline: 'James Sullivan, Sports Department',
      },
      {
        id: 'local-1',
        title: 'SUBWAY FARE REMAINS 5 CENTS DESPITE FINANCIAL TROUBLES',
        content: "The New York Transit Commission announced yesterday that the subway fare will remain at five cents despite mounting financial pressures on the system. Mayor John Francis Hylan has steadfastly opposed any increase, arguing that affordable transportation is essential for working-class New Yorkers. However, transit officials warn that the fixed fare, unchanged since the subway's opening in 1904, is becoming increasingly unsustainable as operational costs rise. The Commission reports that passenger volume has grown substantially in recent years, with daily ridership now exceeding 1.3 million. Plans for system expansion continue despite the financial constraints, with new lines under construction to serve growing neighborhoods in outer boroughs.",
        category: 'local',
        imagePrompt: 'Crowded New York City subway platform in 1924 with passengers in period clothing boarding a train, black and white historical photograph',
        byline: 'Eleanor Davis, Metropolitan Desk',
      },
      {
        id: 'entertainment-1',
        title: 'CHAPLIN\'S "THE GOLD RUSH" DELIGHTS FIRST AUDIENCES',
        content: "Charlie Chaplin\'s latest motion picture, 'The Gold Rush,' premiered to enthusiastic audiences this weekend. The film, which Chaplin both directed and stars in, follows his famous 'Little Tramp' character as he seeks fortune in the Alaskan gold fields. Critics are hailing it as possibly his finest work to date, particularly praising the now-famous scene in which Chaplin\'s character cooks and eats his own shoe. The elaborate production reportedly cost nearly $1 million to create, an extraordinary sum reflecting Chaplin\'s meticulous approach and artistic control. Theater owners report long lines and sold-out showings, confirming Chaplin\'s enduring popularity with the movie-going public.",
        category: 'entertainment',
        imagePrompt: 'Charlie Chaplin in costume as the Little Tramp in a scene from The Gold Rush (1924), black and white historical still photograph',
        byline: 'Margaret Windsor, Arts & Leisure',
      },
      {
        id: 'weather-1',
        title: 'FAIR WEATHER EXPECTED TO CONTINUE THROUGH WEEK',
        content: "The Weather Bureau forecasts continued fair conditions for New York City and vicinity through the remainder of the week. Temperatures are expected to reach the mid-70s during daytime hours with overnight lows in the pleasant mid-50s. Light northeasterly winds will provide comfortable conditions for outdoor activities. The favorable weather comes as a relief following last week's unexpected heavy rainfall that caused minor flooding in parts of Lower Manhattan and Brooklyn. Weather Bureau Chief Willis Gregg notes that conditions remain ideal for the season, though farmers in upstate regions continue to express concern about lower-than-average rainfall affecting crops.",
        category: 'weather',
        imagePrompt: 'New Yorkers enjoying a sunny day in Central Park in 1924, with women in long dresses and men in suits and hats, black and white historical photograph',
        byline: 'Harold Jenkins, Weather Bureau Correspondent',
      }
    ];
  }
}

export default new GeminiService();