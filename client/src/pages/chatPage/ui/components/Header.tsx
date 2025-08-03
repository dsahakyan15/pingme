import React from 'react'
import { Link } from 'react-router-dom'
import { UserIcon, PhoneIcon, VideoIcon } from '../../../../widgets/simpleIcons'

interface HeaderProps {
  isConnected: boolean;
  connectionError?: string;
  reconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ isConnected, connectionError, reconnect }) => {
  return (
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 animate-in fade-in slide-in-from-top-5">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Group Chat
              </h1>
              <p
                className={`text-sm ${isConnected ? "text-green-600" : "text-red-500"
                  }`}
              >
                {isConnected ? "в сети" : "не в сети"}
              </p>
              {connectionError && (
                <p className="text-xs text-red-500">{connectionError}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isConnected && (
              <button
                onClick={reconnect}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                🔄 Переподключить
              </button>
            )}
            <Link
              to="/"
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              ← Главная
            </Link>
            <Link
              to="/ai"
              className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              🤖 AI
            </Link>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <PhoneIcon className="h-6 w-6 text-slate-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <VideoIcon className="h-6 w-6 text-slate-600" />
            </button>
          </div>
        </div>
      </header>
  )
}

export default Header