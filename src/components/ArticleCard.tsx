import React, { useState, useEffect } from 'react';
import { HistoricalEvent } from '../types';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageService from '../services/ImageService';

interface ArticleCardProps {
  article: HistoricalEvent;
  isFeature?: boolean;
  onContextRequest: (topic: string) => void;
  onVideoRequest: (title: string, prompt: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  isFeature = false,
  onContextRequest,
  onVideoRequest
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(article.imageUrl);
  
  useEffect(() => {
    const loadImage = async () => {
      if (article.imagePrompt && !article.imageUrl) {
        try {
          console.log('Generating AI image for article:', article.title);
          // Pass the full article data to generate more contextual images
          const url = await ImageService.generateImage(article.imagePrompt, article);
          setImageUrl(url);
          console.log('Image generated successfully for:', article.title);
        } catch (error) {
          console.error('Failed to generate image for article:', article.title, error);
        }
      }
    };
    
    loadImage();
  }, [article]);

  const handleContextClick = () => {
    onContextRequest(article.title);
  };

  const handleVideoClick = () => {
    if (article.imagePrompt) {
      onVideoRequest(article.title, article.imagePrompt);
    }
  };

  return (
    <motion.article 
      className={`article-card ${isFeature ? 'col-span-12 md:col-span-8' : 'col-span-12 md:col-span-4'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {imageUrl && (
        <div className="mb-4 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={article.title} 
            className="w-full h-auto object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
            style={{ aspectRatio: '16/9' }}
          />
        </div>
      )}
      
      <h2 className={isFeature ? 'headline' : 'subheadline'}>
        {article.title}
      </h2>
      
      {article.byline && <div className="byline">{article.byline}</div>}
      
      <div className="article-text mt-3">
        {article.content}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <button 
          onClick={handleContextClick}
          className="btn-primary flex items-center text-sm"
        >
          <Info size={16} className="mr-1" />
          Additional Context
        </button>
        
        <button 
          onClick={handleVideoClick}
          className="btn-primary flex items-center text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          View Historical Footage
        </button>
      </div>
    </motion.article>
  );
};

export default ArticleCard;
