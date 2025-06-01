import React from 'react';
import ReactModal from 'react-modal';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoContent: string;
  loading: boolean;
}

// For accessibility - bind modal to app root
ReactModal.setAppElement('#root');

const VideoModal: React.FC<VideoModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  videoContent,
  loading
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Historical Video"
      className="max-w-4xl mx-auto mt-20 bg-newspaper-light p-6 rounded-md shadow-newspaper overflow-auto border border-gray-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-serif font-bold">Historical Footage: {title}</h2>
        <button 
          onClick={onClose}
          className="bg-transparent border-none cursor-pointer p-1"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>

      <div className="newspaper-divider"></div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4">Generating historical video footage...</p>
          <p className="mt-2 text-sm text-gray-600">This may take a moment as we recreate scenes from 1924</p>
        </div>
      ) : (
        <div className="aspect-video bg-black flex items-center justify-center">
          <p className="text-white text-center p-8">
            {videoContent || "Video generation requires Gemini Veo API integration. This feature would display AI-generated video recreating the historical event."}
          </p>
        </div>
      )}

      <div className="newspaper-divider"></div>
      
      <div className="text-xs text-gray-600 mt-4">
        Note: This is an AI recreation based on historical accounts and may not perfectly represent the actual historical footage.
      </div>
    </ReactModal>
  );
};

export default VideoModal;