import crypto from 'crypto';

export const getMessageId = () => `m_${crypto.randomBytes(16).toString('hex')}`;