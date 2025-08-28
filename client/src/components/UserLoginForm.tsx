import React, { useState } from 'react';
import { useWebSocketRTK } from '@/hooks';

const UserLoginForm: React.FC= () => {
  const [username, setUsername] = useState('');

const {sendMessage} = useWebSocketRTK()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) {
      sendMessage('user.register', { username: username.trim() });


      //TODO
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-xs p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Join Chat</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-semibold text-gray-600 sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 text-gray-700 bg-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLoginForm;
