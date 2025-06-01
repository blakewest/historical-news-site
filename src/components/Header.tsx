import React from 'react';
import { Newspaper } from 'lucide-react';
import { formatNewspaperDate, formatCurrentDate } from '../utils/dateUtils';
import { APP_TITLE } from '../config/constants';

interface HeaderProps {
  historicalDate: Date;
}

const Header: React.FC<HeaderProps> = ({ historicalDate }) => {
  return (
    <header className="border-b border-gray-900 pb-4">
      <div className="text-center py-4">
        <div className="flex items-center justify-center mb-2">
          <Newspaper className="h-8 w-8 mr-2" />
          <h1 className="text-5xl sm:text-6xl font-serif font-black tracking-tighter">
            {APP_TITLE}
          </h1>
        </div>
        <div className="text-xs font-sans uppercase tracking-wider mb-2">
          "All the news from a century ago"
        </div>
        <div className="flex justify-between items-center px-4 text-xs font-sans">
          <div className="hidden sm:block">VOL. LXXIII... No. 24,217</div>
          <time className="font-bold">{formatNewspaperDate(historicalDate)}</time>
          <div className="hidden sm:block">NEW YORK, USA</div>
        </div>
      </div>
      <div className="text-xs border-t border-b border-gray-900 py-2 px-4 flex justify-between">
        <span>Published {formatCurrentDate()}</span>
        <span>Historical recreation of news from exactly 100 years ago</span>
      </div>
    </header>
  );
};

export default Header;