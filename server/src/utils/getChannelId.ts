import crypto from 'crypto';

export const getChannelId = () => `c_${crypto.randomBytes(8).toString('hex')}`;
