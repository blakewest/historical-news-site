import React from 'react';
import ReactModal from 'react-modal';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  loading: boolean;
}

// For accessibility - bind modal to app root
ReactModal.setAppElement('#root');

const ContextModal: React.FC<ContextModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  content,
  loading 
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Additional Historical Context"
      className="max-w-2xl mx-auto mt-20 bg-newspaper-light p-6 rounded-md shadow-newspaper overflow-auto border border-gray-300"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-serif font-bold">Additional Context: {title}</h2>
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
        <div className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Retrieving historical context...</p>
        </div>
      ) : (
        <motion.div 
          className="prose article-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </motion.div>
      )}

      <div className="newspaper-divider"></div>
      
      <div className="text-xs text-gray-600 mt-4">
        Note: This context represents information as it would have been known in 1924 and does not include later developments or modern perspectives.
      </div>
    </ReactModal>
  );
};

export default ContextModal;