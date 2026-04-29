import React, { useState, useCallback } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Stroke, DrawingTool } from './types';
import { useCollaboration } from './hooks/useCollaboration';

function App() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState('#000000');
  const [width, setWidth] = useState(4);
  const [tool, setTool] = useState<DrawingTool>('pen');

  const handleStrokeReceived = useCallback((stroke: Stroke) => {
    setStrokes((prev) => [...prev, stroke]);
  }, []);

  const { broadcastStroke } = useCollaboration(handleStrokeReceived);

  const handleStrokeComplete = (stroke: Stroke) => {
    setStrokes((prev) => [...prev, stroke]);
    broadcastStroke(stroke);
  };

  const handleClear = () => {
    setStrokes([]);
    // Note: Clearing is local only for now unless we broadcast a clear event
  };

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden">
      <Canvas
        strokes={strokes}
        onStrokeComplete={handleStrokeComplete}
        color={tool === 'eraser' ? '#ffffff' : color}
        width={tool === 'eraser' ? 20 : width}
      />

      <Toolbar
        currentTool={tool}
        setTool={setTool}
        onClear={handleClear}
      />

      <PropertiesPanel
        color={color}
        setColor={setColor}
        width={width}
        setWidth={setWidth}
      />

      <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
        Open multiple tabs to collaborate
      </div>
    </div>
  );
}

export default App;
