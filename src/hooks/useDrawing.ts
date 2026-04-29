import { useState, useCallback, useRef } from 'react';
import { Point, Stroke } from '../types';
import { nanoid } from 'nanoid';

export const useDrawing = (
    onStrokeComplete: (stroke: Stroke) => void,
    color: string,
    width: number
) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

    const startDrawing = useCallback((point: Point) => {
        setIsDrawing(true);
        setCurrentStroke({
            id: nanoid(),
            points: [point],
            color,
            width,
        });
    }, [color, width]);

    const draw = useCallback((point: Point) => {
        if (!isDrawing || !currentStroke) return;

        setCurrentStroke((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                points: [...prev.points, point],
            };
        });
    }, [isDrawing, currentStroke]);

    const stopDrawing = useCallback(() => {
        if (isDrawing && currentStroke) {
            onStrokeComplete(currentStroke);
        }
        setIsDrawing(false);
        setCurrentStroke(null);
    }, [isDrawing, currentStroke, onStrokeComplete]);

    return {
        isDrawing,
        currentStroke,
        startDrawing,
        draw,
        stopDrawing,
    };
};
