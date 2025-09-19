import { kv } from '@vercel/kv';

export const load = async () => {
    const sessions = await kv.get('study-sessions');
    return { sessions: sessions || [] };
};

export const actions = {
  saveSession: async ({ request }) => {
    const formData = await request.formData();
    const subject = formData.get('subject');
    const rating = formData.get('rating');

    // Fetch current sessions or default to empty array
    const sessions = (await kv.get('study-sessions')) || [];

    // Create a new session object
    const newSession = {
      date: new Date().toDateString(),
      subject,
      duration: parseInt(formData.get('duration'), 10) || 0,
      rating: parseInt(rating, 10) || 0
    };

    // Add new session
    sessions.push(newSession);

    // Save updated sessions array back to KV
    await kv.set('study-sessions', sessions);

    return { success: true };
  }
};
