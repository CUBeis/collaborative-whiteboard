import { useState } from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { useYjsStore } from './useYjsStore';

function LandingPage() {
  const [roomCode, setRoomCode] = useState('');

  const generateRoomCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 9; i++) {
      if (i > 0 && i % 3 === 0) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createRoom = () => {
    const newRoom = generateRoomCode();
    window.location.href = `/?room=${newRoom}`;
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      window.location.href = `/?room=${roomCode.trim()}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-900 tracking-tight">Whiteboard</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Draw and collaborate in real-time</p>

        <button
          onClick={createRoom}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Room
        </button>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold tracking-wider uppercase">Or join existing</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={joinRoom} className="space-y-4">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-semibold text-gray-700 mb-2">Room Code</label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder-gray-400"
              placeholder="e.g. abc-def-ghi"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={!roomCode.trim()}
            className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Join Room
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        Peer-to-peer syncing powered by Yjs & WebRTC
      </div>
    </div>
  );
}

function Whiteboard({ roomId }: { roomId: string }) {
  const store = useYjsStore({ roomId });

  if (!store) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Connecting to room...</div>
        </div>
      </div>
    );
  }

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Room link copied to clipboard!');
  };

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden">
      <Tldraw store={store} autoFocus />
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {roomId}
        </div>
        <button
          onClick={copyRoomLink}
          className="bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-sm font-medium text-gray-600 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Link
        </button>
      </div>
    </div>
  );
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get('room');

  if (!roomId) {
    return <LandingPage />;
  }

  return <Whiteboard roomId={roomId} />;
}

export default App;
