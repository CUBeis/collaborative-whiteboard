import React from 'react';
import { Pencil, Eraser, Trash2 } from 'lucide-react';
import { DrawingTool } from '../types';
import clsx from 'clsx';

interface ToolbarProps {
    currentTool: DrawingTool;
    setTool: (tool: DrawingTool) => void;
    onClear: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ currentTool, setTool, onClear }) => {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex gap-2 border border-gray-200">
            <button
                onClick={() => setTool('pen')}
                className={clsx(
                    'p-2 rounded hover:bg-gray-100 transition-colors',
                    currentTool === 'pen' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                )}
                title="Pen"
            >
                <Pencil size={20} />
            </button>
            <button
                onClick={() => setTool('eraser')}
                className={clsx(
                    'p-2 rounded hover:bg-gray-100 transition-colors',
                    currentTool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                )}
                title="Eraser"
            >
                <Eraser size={20} />
            </button>
            <div className="w-px bg-gray-200 mx-1" />
            <button
                onClick={onClear}
                className="p-2 rounded hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                title="Clear Canvas"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};
