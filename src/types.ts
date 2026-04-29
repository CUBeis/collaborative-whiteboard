export type Point = {
    x: number;
    y: number;
};

export type Stroke = {
    id: string;
    points: Point[];
    color: string;
    width: number;
};

export type DrawingTool = 'pen' | 'eraser';

export type AppState = {
    strokes: Stroke[];
    currentColor: string;
    currentWidth: number;
    tool: DrawingTool;
};
