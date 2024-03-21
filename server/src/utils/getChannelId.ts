import crypto from 'crypto';
export const getChannelId = () => crypto.randomUUID() as string; 
