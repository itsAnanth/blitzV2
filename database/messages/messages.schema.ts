type DbMessage = {
    messageId: string;
    author: string;
    timestamp: number;
    recipient: string;
    content: string;
    attachemnt?: {
        type: string,
        url: string
    }
}

export type { DbMessage }