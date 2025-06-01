import React, { useEffect, useState } from 'react';
import { HistoricalEvent, CategoryDefinition, WeatherData } from './types';
import { getHistoricalDate } from './utils/dateUtils';
import { NEWS_CATEGORIES } from './config/constants';
import GeminiService from './services/GeminiService';

// Components
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import ArticleSection from './components/ArticleSection';
import WeatherWidget from './components/WeatherWidget';
import ContextModal from './components/ContextModal';
import VideoModal from './components/VideoModal';
import LoadingSpinner from './components/Loading';

const App: React.FC = () => {
  // State
  const [historicalDate] = useState<Date>(getHistoricalDate());
  const [articles, setArticles] = useState<HistoricalEvent[]>([]);
  const [weather, setWeather] = useState<WeatherData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Context modal state
  const [isContextModalOpen, setIsContextModalOpen] = useState<boolean>(false);
  const [contextTitle, setContextTitle] = useState<string>('');
  const [contextContent, setContextContent] = useState<string>('');
  const [loadingContext, setLoadingContext] = useState<boolean>(false);
  
  // Video modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoContent, setVideoContent] = useState<string>('');
  const [loadingVideo, setLoadingVideo] = useState<boolean>(false);

  useEffect(() => {
    fetchHistoricalContent();
  }, []);

  const fetchHistoricalContent = async () => {
    try {
      setLoading(true);
      const events = await GeminiService.fetchHistoricalEvents(historicalDate);
      setArticles(events);
      
      // Mock weather data for now
      // In a full implementation, this would come from the Gemini API response
      setWeather({
        temperature: '68°F',
        conditions: 'Partly Cloudy',
        description: 'Mild temperatures with occasional cloud cover expected throughout the day. Gentle easterly winds at 5-10 mph.'
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch historical content:', error);
      setError('Failed to load historical content. Please try again later.');
      setLoading(false);
    }
  };

  const handleContextRequest = async (topic: string) => {
    setContextTitle(topic);
    setContextContent('');
    setLoadingContext(true);
    setIsContextModalOpen(true);
    
    try {
      const contextData = await GeminiService.getAdditionalContext({
        topic,
        historicalDate
      });
      setContextContent(contextData);
    } catch (error) {
      setContextContent('Failed to retrieve additional historical context.');
    } finally {
      setLoadingContext(false);
    }
  };

  const handleVideoRequest = async (title: string, prompt: string) => {
    setVideoTitle(title);
    setVideoContent('');
    setLoadingVideo(true);
    setIsVideoModalOpen(true);
    
    try {
      const videoResponse = await GeminiService.generateVideo({
        eventTitle: title,
        prompt
      });
      setVideoContent(videoResponse);
    } catch (error) {
      setVideoContent('Failed to generate historical video.');
    } finally {
      setLoadingVideo(false);
    }
  };

  const getArticlesByCategory = (categoryId: string): HistoricalEvent[] => {
    return articles.filter(article => article.category === categoryId);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-newspaper-light">
        <div className="bg-white p-8 rounded-lg shadow-newspaper max-w-md">
          <h2 className="text-2xl font-serif font-bold mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={fetchHistoricalContent} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-newspaper-light min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header historicalDate={historicalDate} />
        
        <main className="mt-8">
          {/* Featured Articles - Top Row */}
          <div className="grid grid-cols-12 gap-6 mb-8">
            {/* Main feature - takes 8 columns on medium+ screens */}
            <div className="col-span-12 md:col-span-8">
              {articles.length > 0 && (
                <ArticleCard 
                  article={articles[0]} 
                  isFeature={true}
                  onContextRequest={handleContextRequest}
                  onVideoRequest={handleVideoRequest}
                />
              )}
            </div>
            
            {/* Side column - takes 4 columns on medium+ screens */}
            <div className="col-span-12 md:col-span-4">
              <WeatherWidget weather={weather} date={historicalDate} />
              
              {articles.length > 1 && (
                <ArticleCard 
                  article={articles[1]}
                  onContextRequest={handleContextRequest}
                  onVideoRequest={handleVideoRequest}
                />
              )}
            </div>
          </div>
          
          {/* Category sections */}
          {NEWS_CATEGORIES.map((category: CategoryDefinition) => (
            <ArticleSection 
              key={category.id}
              category={category}
              articles={getArticlesByCategory(category.id)}
              onContextRequest={handleContextRequest}
              onVideoRequest={handleVideoRequest}
            />
          ))}
        </main>
        
        <footer className="mt-12 pt-4 border-t border-gray-900 text-center text-sm">
          <p>© {new Date().getFullYear()} The Historical Times - A digital recreation of history</p>
          <p className="mt-2 text-xs text-gray-600">
            Content generated using AI based on historical research. Images are representative.
          </p>
        </footer>
      </div>
      
      {/* Modals */}
      <ContextModal 
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
        title={contextTitle}
        content={contextContent}
        loading={loadingContext}
      />
      
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title={videoTitle}
        videoContent={videoContent}
        loading={loadingVideo}
      />
    </div>
  );
};

export default App;