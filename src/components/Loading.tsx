import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full" />
      </motion.div>
      
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-serif mb-2">Retrieving History...</h2>
        <p className="text-gray-600">Traveling back 100 years to gather the day's news</p>
      </div>
      
      <div className="mt-8 max-w-md">
        <div className="h-2 bg-gray-300 rounded overflow-hidden">
          <motion.div 
            className="h-full bg-gray-900"
            initial={{ width: '0%' }}
            animate={{ width: ['0%', '100%', '0%'] }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;