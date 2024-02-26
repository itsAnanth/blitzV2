import crypto from 'crypto';
import { uuid } from 'uuidv4';

export const getMessageId = () => `m_${uuid()}`;