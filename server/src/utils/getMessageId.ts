import crypto from 'crypto';

export const getMessageId = () => `m_${crypto.randomBytes(8).toString('hex')}`;