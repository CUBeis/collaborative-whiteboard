import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { useYjsStore } from './useYjsStore'

// Extract a room ID from the URL or use a default
const getRoomId = () => {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get('room');
  if (roomId) return roomId;
  
  // If no room is specified, we use a default room for everyone to join
  return 'default-whiteboard-room-v1';
}

function App() {
  const roomId = getRoomId();
  const storeWithStatus = useYjsStore({ roomId });

  if (storeWithStatus.status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
        <div className="text-xl text-gray-500 font-medium">Loading collaborative whiteboard...</div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden">
      {/* 
        Tldraw provides a complete, polished whiteboard experience.
        The useYjsStore synchronizes the state via WebRTC, enabling real-time collaboration.
      */}
      <Tldraw 
        store={storeWithStatus.store} 
        autoFocus
      />
      
      <div className="absolute top-4 left-4 z-50 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200 text-sm font-medium">
        Room: {roomId}
      </div>
    </div>
  )
}

export default App
