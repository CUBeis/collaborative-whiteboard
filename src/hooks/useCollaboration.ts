import { useEffect, useCallback } from 'react';
import { Stroke } from '../types';

export const useCollaboration = (onStrokeReceived: (stroke: Stroke) => void) => {
    const channelName = 'collaborative-whiteboard';

    useEffect(() => {
        const channel = new BroadcastChannel(channelName);

        channel.onmessage = (event) => {
            if (event.data && event.data.type === 'STROKE') {
                onStrokeReceived(event.data.payload);
            }
        };

        return () => {
            channel.close();
        };
    }, [onStrokeReceived]);

    const broadcastStroke = useCallback((stroke: Stroke) => {
        const channel = new BroadcastChannel(channelName);
        channel.postMessage({
            type: 'STROKE',
            payload: stroke,
        });
        channel.close();
    }, []);

    return { broadcastStroke };
};
