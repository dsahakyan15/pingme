import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isConnected: boolean;
  connectionError?: string;
  onReconnect?: () => void;
  isConnecting?: boolean;
  isReconnecting?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isConnected,
  onReconnect,
  isConnecting = false,
  isReconnecting = false,
}) => {
  const canReconnect = !isConnected && onReconnect && !(isConnecting || isReconnecting);
  const reconnectDisabled = !isConnected && !!onReconnect && (isConnecting || isReconnecting);

  const handleReconnectClick = () => {
    if (!canReconnect || !onReconnect) return;
    onReconnect();
  };

  const handleReconnectKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleReconnectClick();
    }
  };

  return (
    <header
      className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 animate-in fade-in slide-in-from-top-5"
      role="banner"
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left: Logo + Status */}
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold text-slate-800">PingMe</h1>
        </div>

        {/* Right: Navigation */}
        <nav className="flex items-center space-x-3">
          {!isConnected && onReconnect && (
            <button
              type="button"
              onClick={handleReconnectClick}
              onKeyDown={handleReconnectKeyDown}
              tabIndex={0}
              aria-label="Переподключить к серверу"
              disabled={reconnectDisabled}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                reconnectDisabled
                  ? 'bg-red-100 text-red-400'
                  : 'bg-red-100 hover:bg-red-200 text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              }`}
            >
              {isConnecting || isReconnecting ? '⏳ Переподключение' : '🔄 Переподключить'}
            </button>
          )}
          <Link
            to="/"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            aria-label="Перейти на главную страницу"
          >
            ← Главная
          </Link>
          <Link
            to="/ai"
            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Перейти на AI страницу"
          >
            🤖 AI
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
