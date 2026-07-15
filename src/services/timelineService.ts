import { ref, push, get } from 'firebase/database';
import { db } from '../db/firebase';

export interface TimelineEvent {
  id?: string;
  title: string;
  description: string;
  timestamp: number;
}

export const timelineService = {
  async logEvent(targetId: string, title: string, description: string = ''): Promise<void> {
    try {
      const timelineRef = ref(db, `timelines/${targetId}`);
      await push(timelineRef, {
        title,
        description,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Timeline logging failed:', error);
    }
  },

  async getEvents(targetId: string): Promise<TimelineEvent[]> {
    try {
      const timelineRef = ref(db, `timelines/${targetId}`);
      const snapshot = await get(timelineRef);
      if (!snapshot.exists()) return [];
      
      const events = Object.entries(snapshot.val()).map(([key, val]: any) => ({
        id: key,
        ...val,
      }));

      // Sort newest events first
      return events.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Timeline retrieval failed:', error);
      return [];
    }
  },
};
