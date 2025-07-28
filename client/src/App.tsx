import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AIPage from "./pages/AIPage";
import ChatPage from "./pages/ChatPage";

// Компонент главной страницы с навигацией
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">PingMe</h1>
          <p className="text-slate-600">Выберите интерфейс для просмотра</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/ai"
            className="block w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-center font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            🤖 AI Assistant
            <p className="text-sm opacity-90 mt-1">Интерфейс AI помощника</p>
          </Link>

          <Link
            to="/chat"
            className="block w-full p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl text-center font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            💬 Chat Interface
            <p className="text-sm opacity-90 mt-1">Интерфейс мессенджера</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
