// +page.server.js

import { kv } from '@vercel/kv';

export const load = async () => {
    const sessions = (await kv.get('study-sessions')) || [];
    const current = (await kv.get('current-session')) || {
        status: 'stopped',
        elapsed: 0,
        duration: 0
    };
    return { sessions, current };
};

export const actions = {
    saveSession: async ({ request }) => {
        const formData = await request.formData();
        const subject = formData.get('subject');
        const rating = formData.get('rating');
        const duration = formData.get('duration');

        if (!subject || !rating || !duration) {
            return { success: false, error: 'Missing fields' };
        }

        const sessions = (await kv.get('study-sessions')) || [];

        const newSession = {
            date: new Date().toISOString(),
            subject: subject.toString(),
            duration: parseInt(duration, 10) || 0,
            rating: parseInt(rating, 10) || 0
        };

        sessions.push(newSession);

        await kv.set('study-sessions', sessions);

        // Reset current session in KV
        const resetCurrent = {
            status: 'stopped',
            elapsed: 0,
            duration: 0
        };
        await kv.set('current-session', resetCurrent);

        return { success: true };
    },

    updateCurrent: async ({ request }) => {
        const json = await request.json();
        const { status, elapsed, duration } = json;
        if (typeof status !== 'string' ||
            typeof elapsed !== 'number' ||
            typeof duration !== 'number') {
            return { success: false, error: 'Invalid data' };
        }

        await kv.set('current-session', { status, elapsed, duration });

        return { success: true };
    },

    deleteSession: async ({ request }) => {
        const json = await request.json();
        const { index } = json;
        if (typeof index !== 'number') {
            return { success: false, error: 'Invalid index' };
        }

        const sessions = (await kv.get('study-sessions')) || [];
        if (index < 0 || index >= sessions.length) {
            return { success: false, error: 'Index out of bounds' };
        }

        sessions.splice(index, 1);
        await kv.set('study-sessions', sessions);

        return { success: true };
    }
};
