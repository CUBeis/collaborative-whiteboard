import React, { useRef, useEffect } from 'react';
import { Stroke, Point } from '../types';
import { useDrawing } from '../hooks/useDrawing';

interface CanvasProps {
    strokes: Stroke[];
    onStrokeComplete: (stroke: Stroke) => void;
    color: string;
    width: number;
}

export const Canvas: React.FC<CanvasProps> = ({
    strokes,
    onStrokeComplete,
    color,
    width,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { startDrawing, draw, stopDrawing, currentStroke } = useDrawing(
        onStrokeComplete,
        color,
        width
    );

    // Handle resizing
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
                // Trigger redraw
                render();
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const render = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const drawStroke = (stroke: Stroke) => {
            if (stroke.points.length < 2) return;
            ctx.beginPath();
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.width;
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

            for (let i = 1; i < stroke.points.length; i++) {
                ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            ctx.stroke();
        };

        strokes.forEach(drawStroke);
        if (currentStroke) {
            drawStroke(currentStroke);
        }
    };

    // Render loop
    useEffect(() => {
        render();
    }, [strokes, currentStroke]);

    const getPoint = (e: React.MouseEvent | React.TouchEvent): Point | null => {
        if (!canvasRef.current) return null;
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const point = getPoint(e);
        if (point) startDrawing(point);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const point = getPoint(e);
        if (point) draw(point);
    };

    const handleMouseUp = () => {
        stopDrawing();
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-white cursor-crosshair touch-none">
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="block"
            />
        </div>
    );
};
