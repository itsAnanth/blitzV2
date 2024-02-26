import { rdb } from './Firebase';
import ChatMessage from '../../../shared/ChatMessage/ChatMessage';
import { set, get, limitToFirst, query, ref, push, limitToLast } from 'firebase/database';
class Db {

    static async setMessage(channelId: string, message: ChatMessage) {
        const reference = ref(rdb, `messages/${channelId}`);
        const listRef = push(reference)

        const msgid = message.messageId
        set(listRef, message);


    }

    static async getMessages(channelId: string, limit: number = 10) {
        const reference = ref(rdb, `messages/${channelId}`)
        const snapshot = await get(query(reference, limitToLast(limit)));
        const dataArray: ChatMessage[] = [];
        snapshot.forEach(data => {
            dataArray.push(data.val());
        })

        return dataArray;
    }
}

export default Db;