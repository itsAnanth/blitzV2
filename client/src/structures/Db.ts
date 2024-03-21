import { rdb } from './Firebase';
import ChatMessage from '../../../shared/ChatMessage/ChatMessage';
import { set, get, limitToFirst, query, ref, push, limitToLast } from 'firebase/database';
import { User } from 'firebase/auth';
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

    static async setUser(user: User) {
        const userData: { userId: string, channels: string[], photoURL: string } = {
            userId: user.uid,
            channels: [],
            photoURL: ''
        }


        const reference = ref(rdb, `users/${userData.userId}`);

        await set(reference, userData);

        // const listRef = ref(rdb, `users/${userid}`)
    }
}

export default Db;