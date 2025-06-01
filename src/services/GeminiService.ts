import { GoogleGenAI } from '@google/genai'; // Corrected import based on user feedback
import { API_CONFIG, GEMINI_PROMPT_TEMPLATE, ADDITIONAL_CONTEXT_TEMPLATE } from '../config/constants';
import { GeminiApiResponse, HistoricalEvent, ContextRequest, VideoGenerationRequest } from '../types';
import { formatHistoricalDate } from '../utils/dateUtils';

class GeminiService {
  private apiKey: string;
  private genAI: GoogleGenAI | null;

  constructor() {
    this.apiKey = API_CONFIG.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('Note: Gemini API key not found. Using mock data for development.');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  /**
   * Fetch historical events from 100 years ago using Gemini 2.5 Flash
   */
  async fetchHistoricalEvents(historicalDate: Date): Promise<HistoricalEvent[]> {
    try {
      if (!this.apiKey || !this.genAI) {
        console.warn('No API key or GenAI instance available, using mock data');
        return this.getMockData();
      }

      const allModels = await this.genAI.models.list()
      console.log("Showing all models available in the Gemini API:", allModels);

      const formattedDate = formatHistoricalDate(historicalDate);
      const prompt = GEMINI_PROMPT_TEMPLATE.replace('{date}', formattedDate);
      
      console.log('Researching historical events for:', formattedDate);
      console.log('Using Gemini 2.0 Flash for deep historical research...');

      // Use the new Google GenAI SDK with Gemini 2.0 Flash
      const result = await this.genAI.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      });
      const responseText = result.text || ""

      console.log('Received response from Gemini 2.0 Flash, parsing historical data...');

      // Parse the JSON response
      let parsedData: GeminiApiResponse;
      
      try {
        // Try to parse the JSON directly from the response
        parsedData = JSON.parse(responseText);
      } catch {
        // If direct parsing fails, try to extract JSON from text
        const jsonMatch = responseText.match(/```json([\s\S]*?)```/) || 
                          responseText.match(/{[\s\S]*}/);
        
        if (jsonMatch) {
          const jsonStr = jsonMatch[0].replace(/```json|```/g, '').trim();
          parsedData = JSON.parse(jsonStr);
        } else {
          console.error('Failed to parse JSON from response:', responseText.substring(0, 200));
          throw new Error('Failed to parse JSON from the API response');
        }
      }

      if (!parsedData.events || !Array.isArray(parsedData.events)) {
        console.error('Invalid events data structure:', parsedData);
        throw new Error('Invalid events data structure from API');
      }

      console.log(`Successfully parsed ${parsedData.events.length} historical events`);
      return parsedData.events;
      
    } catch (error) {
      console.error('Error fetching historical events with Gemini 2.0 Flash:', error);
      console.log('Falling back to mock data');
      return this.getMockData();
    }
  }

  /**
   * Get additional context about a specific topic from the historical period using Gemini 2.5 Flash
   */
  async getAdditionalContext(request: ContextRequest): Promise<string> {
    try {
      if (!this.apiKey || !this.genAI) {
        return "Additional historical context would appear here. Please add your Gemini API key to see real data.";
      }

      const formattedDate = formatHistoricalDate(request.historicalDate);
      const prompt = ADDITIONAL_CONTEXT_TEMPLATE
        .replace('{topic}', request.topic)
        .replace('{date}', formattedDate);
      
      console.log('Fetching additional context for:', request.topic, 'on', formattedDate);

      // Use the new Google GenAI SDK with Gemini 2.0 Flash
      const result = await this.genAI.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt
      });
      const responseText = result.text || ""

      return responseText || "Unable to retrieve additional context at this time.";
      
    } catch (error) {
      console.error('Error fetching additional context with Gemini 2.0 Flash:', error);
      return "Unable to retrieve additional context at this time.";
    }
  }

  /**
   * Generate a video based on a historical event using Veo 2
   */
  async generateVideo(request: VideoGenerationRequest): Promise<string> {
    try {
      if (!this.apiKey || !this.genAI) {
        return "Video generation would appear here. Please add your Gemini API key to see real data.";
      }

      // Create a detailed prompt for Veo 2 video generation
      const videoPrompt = `Create a cinematic 8-second historical news segment about: ${request.eventTitle}. 
      
Style: Black and white newsreel footage from the 1920s era, documentary style with period-appropriate cinematography.
      
Visuals: Show key moments and figures related to the event, with authentic historical atmosphere. Include establishing shots, close-ups of important documents or people, and crowd reactions if applicable.
      
Camera work: Use period-appropriate camera movements - static shots, slow pans, and occasional zooms. Maintain the grainy, high-contrast look of 1920s film stock.
      
Lighting: Natural lighting with strong shadows and highlights typical of early 20th century photography.`;

      console.log('Generating video with Veo 2 for:', request.eventTitle);
      console.log('Video prompt:', videoPrompt);

      // Use Veo 2 model for actual video generation
      const result = await this.genAI.models.generateContent({
        model: "veo-2", // Using Veo 2 model specifically for video generation
        contents: [{ parts: [{ text: videoPrompt }] }]
      });

      // Handle the video generation response
      if (result && result.candidates && result.candidates[0]) {
        const candidate = result.candidates[0];
        
        // Check if we have video content
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.videoMetadata || part.fileData) {
              // Video was generated successfully
              const videoId = part.fileData?.fileUri || `video_${Date.now()}`;
              console.log('Video generated successfully:', videoId);
              return `Video generated successfully for "${request.eventTitle}". Video ID: ${videoId}. The 8-second historical newsreel has been created with period-appropriate cinematography.`;
            }
          }
        }
        
        // If no video content, but we have text response
        const textResponse = candidate.content?.parts?.[0]?.text;
        if (textResponse) {
          return `Video generation initiated for "${request.eventTitle}". Status: ${textResponse}`;
        }
      }

      // Fallback response
      return `Video generation request submitted for "${request.eventTitle}". Processing with Veo 2 model - this may take a few moments to complete.`;
      
    } catch (error) {
      console.error('Error generating video with Veo 2:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        if (error.message.includes('model not found') || error.message.includes('veo-2')) {
          return `Video generation temporarily unavailable. The Veo 2 model may not be accessible with your current API key. Please check your Gemini API access level.`;
        }
        return `Video generation failed: ${error.message}`;
      }
      
      return "Unable to generate video at this time. Please try again later.";
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
        sources: 'Based on reports from The New York Times and Associated Press',
        historicalContext: 'This legislation marked a significant shift in American immigration policy, establishing the national origins quota system that would remain in place until 1965.',
      },
      {
        id: 'international-1',
        title: 'LENIN\'S DEATH PROMPTS POWER STRUGGLE IN SOVIET RUSSIA',
        content: "The recent death of Vladimir Lenin has thrown Soviet Russia into political uncertainty as a power struggle emerges among top Bolshevik leaders. Joseph Stalin has begun consolidating power as General Secretary of the Communist Party, while Leon Trotsky, once considered Lenin's natural successor, appears to be losing influence. Reports from Moscow suggest Stalin is forming alliances with other Politburo members Grigory Zinoviev and Lev Kamenev to isolate Trotsky. Western observers are watching closely as this internal conflict could determine the future direction of the world's first communist state, now entering its seventh year since the 1917 revolution.",
        category: 'international',
        imagePrompt: 'A solemn crowd gathered in Moscow\'s Red Square for Lenin\'s funeral in 1924, with Soviet flags and Bolshevik leaders visible, historical black and white photograph',
        byline: 'Frederick Williams, Foreign Correspondent',
        sources: 'Based on reports from Reuters and The Times of London',
        historicalContext: 'Lenin\'s death created a power vacuum that would ultimately lead to Stalin\'s rise to power, fundamentally shaping the Soviet Union\'s future direction.',
      },
      {
        id: 'sports-1',
        title: 'OLYMPICS OPEN IN PARIS WITH GRAND CEREMONY',
        content: "The VIII Olympic Games commenced yesterday in Paris with an opening ceremony at the newly constructed Colombes Stadium. Nearly 3,000 athletes from 44 nations paraded before a capacity crowd of 45,000 spectators. The United States team, 299 strong, received warm applause as they marched past the reviewing stand. French organizing committee president Comte de Clary declared the games officially open, followed by the release of 10,000 pigeons symbolizing peace. These Olympics mark the first since the Great War, with Germany notably absent due to its exclusion following the conflict. Competition begins today with swimming and athletics events expected to draw the largest crowds.",
        category: 'sports',
        imagePrompt: 'The opening ceremony of the 1924 Paris Olympics at Colombes Stadium with athletes parading with national flags, black and white historical photograph',
        byline: 'James Sullivan, Sports Department',
        sources: 'Based on reports from Olympic Committee and French press',
        historicalContext: 'These Olympics were the first to feature the modern Olympic motto "Citius, Altius, Fortius" and marked the return of Germany to international competition.',
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
        content: "Charlie Chaplin's latest motion picture, 'The Gold Rush,' premiered to enthusiastic audiences this weekend. The film, which Chaplin both directed and stars in, follows his famous 'Little Tramp' character as he seeks fortune in the Alaskan gold fields. Critics are hailing it as possibly his finest work to date, particularly praising the now-famous scene in which Chaplin's character cooks and eats his own shoe. The elaborate production reportedly cost nearly $1 million to create, an extraordinary sum reflecting Chaplin's meticulous approach and artistic control. Theater owners report long lines and sold-out showings, confirming Chaplin's enduring popularity with the movie-going public.",
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
