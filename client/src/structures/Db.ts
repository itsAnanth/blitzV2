import { rdb } from './Firebase';
import ChatMessage from '../../../shared/ChatMessage/ChatMessage';
import { set, get, limitToFirst, query, ref, push, limitToLast, equalTo, orderByChild, onValue } from 'firebase/database';
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

    static async setUserChannel(user: User, channelId: string, flag: 'add' | 'remove') {
        const reference = ref(rdb, `users`);
        let data = null as any;

        const snap = await get(query(reference, orderByChild('userId'), equalTo(user.uid)))

        snap.forEach(s => {
            data = s.val();
        })

        if (!data.channels)
            data.channels = [];

        if (flag == 'add') {
            data.channels.push(channelId)
        } else {
            data.channels.splice(data.channels.indexOf(channelId), 1);
        }

        await set(ref(rdb, `users/${user.uid}`), data);

    }

    static async setUser(user: User) {
        const userData: { key: string, userId: string, channels: string[], photoURL: string } = {
            userId: user.uid,
            channels: [],
            photoURL: '',
            key: "null"
        }


        const reference = ref(rdb, `users`);
        const pushRef = push(reference);

        userData.key = pushRef.key as string;

        await set(pushRef, userData);

        // const listRef = ref(rdb, `users/${userid}`)
    }

    static async getUser(user: User) {
        const reference = ref(rdb, `users`);
        let data = null;

        const snap = await get(query(reference, orderByChild('userId'), equalTo(user.uid)))

        snap.forEach(s => {
            data = s.val();
        })
        // onValue(query(reference, orderByChild('userId'), equalTo(user.uid)), snap => {
        // data = Object.values(snap.val())[0];
        // });


        return data;

    }
}

export default Db;