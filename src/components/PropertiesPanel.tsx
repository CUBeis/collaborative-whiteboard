import React from 'react';
import clsx from 'clsx';

interface PropertiesPanelProps {
    color: string;
    setColor: (color: string) => void;
    width: number;
    setWidth: (width: number) => void;
}

const COLORS = [
    '#000000', // Black
    '#ef4444', // Red
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#eab308', // Yellow
    '#a855f7', // Purple
];

const WIDTHS = [2, 4, 6, 8, 12];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    color,
    setColor,
    width,
    setWidth,
}) => {
    return (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-3 flex flex-col gap-4 border border-gray-200">
            <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Color</span>
                <div className="grid grid-cols-2 gap-2">
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={clsx(
                                'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                                color === c ? 'border-gray-400 scale-110' : 'border-transparent'
                            )}
                            style={{ backgroundColor: c }}
                            aria-label={`Select color ${c}`}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase">Size</span>
                <div className="flex flex-col gap-2 items-center">
                    {WIDTHS.map((w) => (
                        <button
                            key={w}
                            onClick={() => setWidth(w)}
                            className={clsx(
                                'w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 transition-colors',
                                width === w ? 'bg-gray-100' : ''
                            )}
                        >
                            <div
                                className="rounded-full bg-black"
                                style={{ width: w, height: w }}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
