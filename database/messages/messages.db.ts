import { Database, get, limitToFirst, limitToLast, push, query, ref, set } from "firebase/database";
import { DbMessage } from "./messages.schema";


class MessagesDb {

    rdb: Database;

    constructor(rdb: Database) {
        this.rdb = rdb
    }

    async setMessage(channelId: string, message: DbMessage) {
        const reference = ref(this.rdb, `messages/${channelId}`);
        const listRef = push(reference)

    

        await set(listRef, message);

        console.log("DB SETTING DATA", message)


    }

    async getMessages(channelId: string, limit: number = 10) {
        const reference = ref(this.rdb, `messages/${channelId}`)
        const snapshot = await get(query(reference, limitToLast(limit)));
        const dataArray: DbMessage[] = [];
        
        snapshot.forEach(data => {
            dataArray.push(data.val());
        })

        return dataArray;
    }
}

export default MessagesDb;