import { API_CONFIG } from '../config/constants';
import axios from 'axios';

class ImageService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = API_CONFIG.GEMINI_API_KEY;
  }

  /**
   * Generate an image based on a text prompt
   * Note: For the MVP we're using Pexels stock photos as placeholders
   * In a production app, this would connect to an actual image generation API
   */
  async generateImage(prompt: string): Promise<string> {
    // In a real implementation, this would call an image generation API
    // For now, we'll return stock photos that match historical themes
    
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