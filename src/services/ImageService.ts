import { GoogleGenAI } from '@google/genai';
import { API_CONFIG } from '../config/constants';
import { HistoricalEvent } from '../types';

class ImageService {
  private apiKey: string;
  private genAI: GoogleGenAI | null;
  
  constructor() {
    this.apiKey = API_CONFIG.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('Note: Gemini API key not found. Using stock images for development.');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  /**
   * Generate an image based on a historical event using Imagen 3
   */
  async generateImage(prompt: string, event?: HistoricalEvent): Promise<string> {
    try {
      if (!this.apiKey || !this.genAI) {
        console.warn('No API key available, using stock images');
        return this.getStockImage(prompt);
      }

      // Create a detailed image prompt based on the article content
      let enhancedPrompt = prompt;
      if (event) {
        enhancedPrompt = `Historical photograph from 1925: ${prompt}. 
        
Context from article: ${event.title}. ${event.content.substring(0, 200)}...
        
Style: Black and white vintage photograph, 1920s era, documentary photography style, high contrast, grainy texture typical of 1920s photography. Authentic historical atmosphere with period-appropriate clothing, architecture, and technology. Professional newspaper photography quality.`;
      } else {
        enhancedPrompt = `Historical photograph from 1925: ${prompt}. Style: Black and white vintage photograph, 1920s era, documentary photography style, high contrast, grainy texture typical of 1920s photography.`;
      }

      console.log('Generating image with Imagen 3 for:', prompt);
      console.log('Enhanced prompt:', enhancedPrompt.substring(0, 100) + '...');

      // Use Imagen 3 model for image generation
      const result = await this.genAI.models.generateContent({
        model: "imagen-3.0-generate-001",
        contents: enhancedPrompt
      });

      // Handle the image generation response
      if (result && result.candidates && result.candidates[0]) {
        const candidate = result.candidates[0];
        
        // Check if we have image content
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              // Convert base64 image data to data URL
              const mimeType = part.inlineData.mimeType || 'image/jpeg';
              const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
              console.log('Image generated successfully');
              return imageUrl;
            }
            if (part.fileData && part.fileData.fileUri) {
              // If we get a file URI, return it directly
              console.log('Image generated with file URI:', part.fileData.fileUri);
              return part.fileData.fileUri;
            }
          }
        }
      }

      // If image generation didn't work, fall back to stock images
      console.warn('Image generation did not return expected format, using stock image');
      return this.getStockImage(prompt);
      
    } catch (error) {
      console.error('Error generating image with Imagen 3:', error);
      console.log('Falling back to stock images');
      return this.getStockImage(prompt);
    }
  }

  /**
   * Fallback method to get stock images when AI generation fails
   */
  private getStockImage(prompt: string): string {
    const stockImages = [
      'https://images.pexels.com/photos/2166456/pexels-photo-2166456.jpeg', // Vintage documents
      'https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg', // Old newspaper
      'https://images.pexels.com/photos/2873479/pexels-photo-2873479.jpeg', // Historical building
      'https://images.pexels.com/photos/10606398/pexels-photo-10606398.jpeg', // Old train
      'https://images.pexels.com/photos/5858280/pexels-photo-5858280.jpeg', // Vintage portrait
      'https://images.pexels.com/photos/2187439/pexels-photo-2187439.jpeg', // Vintage car
      'https://images.pexels.com/photos/4016459/pexels-photo-4016459.jpeg', // Old architecture
      'https://images.pexels.com/photos/4065624/pexels-photo-4065624.jpeg', // Vintage clothing
    ];
    
    // Deterministically select an image based on the prompt to ensure consistency
    const promptHash = this.simpleHash(prompt);
    const imageIndex = promptHash % stockImages.length;
    
    return stockImages[imageIndex];
  }
  
  /**
   * Simple string hashing function to convert a string to a number
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}

export default new ImageService();
