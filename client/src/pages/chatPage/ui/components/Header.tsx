import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { UserIcon } from '../../../../widgets/simpleIcons'

interface HeaderProps {
  isConnected: boolean;
  connectionError?: string;
  onReconnect?: () => void;
  isConnecting?: boolean;
  isReconnecting?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isConnected,
  connectionError,
  onReconnect,
  isConnecting = false,
  isReconnecting = false,
}) => {
  const { statusText, statusColorClass } = useMemo(() => {
    if (isConnected) return { statusText: 'в сети', statusColorClass: 'text-green-600' };
    if (isConnecting || isReconnecting) return { statusText: 'переподключение...', statusColorClass: 'text-amber-500' };
    return { statusText: 'не в сети', statusColorClass: 'text-red-500' };
  }, [isConnected, isConnecting, isReconnecting]);

  const canReconnect = !isConnected && onReconnect && !(isConnecting || isReconnecting);
  const reconnectDisabled = !isConnected && !!onReconnect && (isConnecting || isReconnecting);

  const handleReconnectClick = () => {
    if (!canReconnect || !onReconnect) return;
    onReconnect();
  };

  const presenceDotClass = isConnected ? 'bg-green-500' : (isConnecting || isReconnecting) ? 'bg-amber-400' : 'bg-red-400';

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 animate-in fade-in slide-in-from-top-5" role="banner">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Left: Identity + Status */}
        <div className="flex items-center space-x-4">
          <div className="relative" aria-label={isConnected ? 'User online' : 'User offline'}>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg" role="img" aria-label="User avatar">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${presenceDotClass} border-2 border-white rounded-full`} aria-hidden="true" />
          </div>
          <div className="select-none">
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Group Chat</h1>
            <p className={`text-sm ${statusColorClass}`} aria-live="polite">{statusText}</p>
            {connectionError && (
              <p className="text-xs text-red-500" role="alert">{connectionError}</p>
            )}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-3">
          {!isConnected && onReconnect && (
            <button
              type="button"
              onClick={handleReconnectClick}
              onKeyDown={(e) => { if (e.key === 'Enter') handleReconnectClick(); }}
              tabIndex={0}
              aria-label="Переподключить"
              disabled={reconnectDisabled}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${reconnectDisabled ? 'bg-red-100 text-red-400' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
            >
              {(isConnecting || isReconnecting) ? '⏳ Переподключение' : '🔄 Переподключить'}
            </button>
          )}
          <Link
            to="/"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            aria-label="На главную"
          >
            ← Главная
          </Link>
          <Link
            to="/ai"
            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            aria-label="AI страница"
          >
            🤖 AI
          </Link>
         
        </div>
      </div>
    </header>
  );
};

export default Header