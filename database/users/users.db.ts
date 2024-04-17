import { Database, equalTo, get, orderByChild, query, ref, set } from "firebase/database";
import { User } from 'firebase/auth';
import { DbUser } from "./users.schema";
import { DbChannel } from "../channels/channels.schema";

class UsersDb {
    
    rdb: Database;

    constructor(rdb: Database) {
        this.rdb = rdb;


    }

    async setUser(user: User) {
        const userData: DbUser = {
            userId: user.uid,
            channels: [],
            photoURL: '',
            timestamp: Date.now(),
            username: user.displayName
        }



        await set(ref(this.rdb, `users/${user.uid}`), userData);

        // const listRef = ref(rdb, `users/${userid}`)
    }

    async getUser(user: User): Promise<DbUser | null> {
        const reference = ref(this.rdb, `users`);
        let data: DbUser;

        const snap = await get(query(reference, orderByChild('userId'), equalTo(user.uid)))

        snap.forEach(s => {
            data = s.val();
        })
        // onValue(query(reference, orderByChild('userId'), equalTo(user.uid)), snap => {
        // data = Object.values(snap.val())[0];
        // });


        return data ?? null;

    }


    /**
     * get detailed list of channels that the user is in
     * used for displaying in channels sidebar
     * @param userId 
     * @returns 
     */
    async getChannelsInUser(userId: string) {
        const reference = ref(this.rdb, `users`);
        const channelReference = ref(this.rdb, `channels`);
        let data: DbUser;
        
        const snap = await (get(query(reference, orderByChild("userId"), equalTo(userId))));
        const channels = [];
        snap.forEach(s => {
            data = s.val();
        })

        for (let i = 0; i < data.channels.length; i++) {
            const channelId = data.channels[i];
            let channel: DbChannel;
            const userSnap = await (get(query(channelReference, orderByChild("channelId"), equalTo(channelId))));

            userSnap.forEach(s => {
                channel = s.val();
            });

            // delete user.channels;

            channels.push(channel);
        }

        return channels;
    }

    async getUserById(userId: string): Promise<DbUser | null> {
        const reference = ref(this.rdb, 'users');
        let data: DbUser;
        const snap = await (get(query(reference, orderByChild("userId"), equalTo(userId))));

        snap.forEach(s => {
            data = s.val();
        })

        return data ?? null;
    }

    async getUserChannels(user: User): Promise<string[]> {
        const reference = ref(this.rdb, `users`);
        let data: DbUser;

        const snap = await get(query(reference, orderByChild('userId'), equalTo(user.uid)))

        snap.forEach(s => {
            data = s.val();
        })
        // onValue(query(reference, orderByChild('userId'), equalTo(user.uid)), snap => {
        // data = Object.values(snap.val())[0];
        // });


        return data.channels ?? [];

    }

    async setUserChannel(user: User, channel: string, flag: 'add' | 'remove') {
        const reference = ref(this.rdb, `users`);
        let data = null as any;

        const snap = await get(query(reference, orderByChild('userId'), equalTo(user.uid)))

        snap.forEach(s => {
            data = s.val();
        })

        if (!data.channels)
            data.channels = [];

        if (flag == 'add') {
            data.channels.push(channel)
        } else {
            data.channels.splice(data.channels.indexOf(channel), 1);
        }

        await set(ref(this.rdb, `users/${user.uid}`), data);

    }

}

export default UsersDb;