import { equalTo, get, limitToFirst, onValue, orderByChild, push, query, ref, set } from "firebase/database";
import { rdb } from "./Firebase";
import type ChannelType from '../../../shared/Channel/Channel';
import ChatMessage from '../../../shared/ChatMessage/ChatMessage';
import { getChannelId } from "../utils";

class Db {

    static async setMessage(channelId: string, message: ChatMessage) {
        const reference = ref(rdb, `messages/${channelId}`);
        const listRef = push(reference)

    

        await set(listRef, message);

        console.log("DB SETTING DATA", message)


    }

    static async setChannel({ name, owner }: { name: string, owner: string }) {
        const reference = ref(rdb, `channels`);
        
        const channelData: ChannelType = {
            name: name,
            channelId: 'temp',
            owner: owner,
            timestamp: Date.now(),
            users: [owner]
        }

        const listRef = push(reference);


        channelData.channelId = listRef.key;

        await set(listRef, channelData);


        return channelData

    }

    static async updateChannel(newData: ChannelType) {
        // const reference = ref(rdb, `channels`);
        // const snapshot = await get(query(reference, orderByChild('channelId'), equalTo(newData.channelId)));
        // const dataArray: ChannelType[] = [];
        // snapshot.forEach(data => {
        //     dataArray.push(data.val());
        // });
        await set(ref(rdb, `channels/${newData.channelId}`), newData);
    }

    

    static async getMessageById(channelId: string) {

        const reference = ref(rdb, `messages/${channelId}`)

        // onValue(query(reference, orderByChild('messageId'), equalTo('m_ddcb98ac-f91d-4274-878e-c6ef28fb72a0')), snap => {
        //     // console.log(snap.key)
        //     console.log(Object.values(snap.val()))
        // })
        const snapshot = await get(query(reference, orderByChild('messageId'), equalTo('m_ede59c1d-e125-4f1d-89f4-21da8fbe44d5')));
        // const dataArray: ChatMessage[] = [];
        // console.log(snapshot.size)
        // const dat: any[] = [];
        // snapshot.forEach(data => {
        //     // console.log(data.val())
        //     dat.push({ ...data.val(), key: data.key })
        // })
        // console.log(dat)
        // dat[0].author = 'bot1';
        // await set(ref(rdb, `messages/${channelId}/${dat[0].key}`), dat[0]);
        // console.log('done')
        
        // return dataArray;
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