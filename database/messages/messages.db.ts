import { Database, get, limitToFirst, limitToLast, orderByChild, orderByKey, push, query, ref, set, startAt } from "firebase/database";
import { DbMessage } from "./messages.schema";
import { getDownloadURL, getStorage, uploadBytes, ref as storageRef } from "firebase/storage";



class MessagesDb {

    rdb: Database;

    constructor(rdb: Database) {
        this.rdb = rdb
    }

    async setMessage(channelId: string, message: DbMessage) {
        const reference = ref(this.rdb, `messages/${channelId}`);

        const listRef = push(reference)

    
        message.messageId = listRef.key;

        await set(listRef, message);

        console.log("DB SETTING DATA", message)


    }

    async getMessagesInRange(channelId: string, _start: number, _end?: number) {
        const reference = ref(this.rdb, `messages/${channelId}`)
        const snapshot = await get(query(reference));
        const dataArray: DbMessage[] = [];
        
        snapshot.forEach(data => {
            dataArray.push(data.val());
        })

        return dataArray.slice(_start ?? 0, _end ?? dataArray.length);
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

    async uploadMedia(file: File, channelId: string) {
        const storage = getStorage();
        
        const fileRef = storageRef(storage, `media/${channelId}/${crypto.randomUUID()}.png`);
        
        


        const snapshot = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);


        return url;
    }

}

export default MessagesDb;