import React from 'react';
import { HistoricalEvent, CategoryDefinition } from '../types';
import ArticleCard from './ArticleCard';
import { motion } from 'framer-motion';

interface ArticleSectionProps {
  category: CategoryDefinition;
  articles: HistoricalEvent[];
  onContextRequest: (topic: string) => void;
  onVideoRequest: (title: string, prompt: string) => void;
}

const ArticleSection: React.FC<ArticleSectionProps> = ({ 
  category, 
  articles,
  onContextRequest,
  onVideoRequest
}) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-serif font-bold uppercase tracking-wide border-b-2 border-gray-900 mb-4 pb-1">
          {category.name}
        </h3>
        
        <div className="grid grid-cols-12 gap-4">
          {articles.map((article, index) => (
            <ArticleCard 
              key={article.id}
              article={article} 
              isFeature={index === 0 && articles.length > 1}
              onContextRequest={onContextRequest}
              onVideoRequest={onVideoRequest}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ArticleSection;