import { get, limitToFirst, push, query, ref, set } from "firebase/database";
import { rdb } from "./Firebase";
import ChatMessage from '../../../shared/ChatMessage/ChatMessage';

class Db {

    static async setMessage(channelId: string, message: ChatMessage) {
        const reference = ref(rdb, `messages/${channelId}`);
        const listRef = push(reference)

        await set(listRef, message);

        console.log("DB SETTING DATA", message)


    }

    static async getMessages(channelId: string, limit: number = 10) {
        const reference = ref(rdb, `messages/${channelId}`)
        const snapshot = await get(query(reference, limitToFirst(limit)));
        const dataArray: ChatMessage[] = [];
        snapshot.forEach(data => {
            dataArray.push(data.val());
        })

        return dataArray;
    }
}

export default Db;