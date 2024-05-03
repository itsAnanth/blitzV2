import { Database, equalTo, get, orderByChild, push, query, ref, set } from "firebase/database";
import { DbChannel } from "./channels.schema";
import { DbUser } from "../users/users.schema";

class ChannelsDb {

    rdb: Database;

    constructor(rdb: Database) {
        this.rdb = rdb;
    }


    /**
     * get the detailed list of users in a specific channel
     * @param channelId 
     * @returns 
     */
    async getUsersInChannel(channelId: string) {
        const reference = ref(this.rdb, `channels`);
        const userReference = ref(this.rdb, `users`);
        let data: DbChannel;
        
        const snap = await (get(query(reference, orderByChild("channelId"), equalTo(channelId))));
        const users = [];
        snap.forEach(s => {
            data = s.val();
        })

        for (let i = 0; i < data.users.length; i++) {
            const userId = data.users[i];
            let user: DbUser;
            const userSnap = await (get(query(userReference, orderByChild("userId"), equalTo(userId))));

            userSnap.forEach(s => {
                user = s.val();
            });

            if (!user) continue;

            if (user.channels) delete user?.channels;

            users.push(user);
        }

        return users;
    }


    async getChannelById(channelId: string): Promise<DbChannel | null> {
        const reference = ref(this.rdb, `channels`);
        let data: DbChannel;
        
        const snap = await (get(query(reference, orderByChild("channelId"), equalTo(channelId))));

        snap.forEach(s => {
            data = s.val();
        })

        return data ?? null;
    }


    async addUserToChannel(channelId: string, userId: string) {
        const reference = ref(this.rdb, `channels`);
        let data: DbChannel;
        const snap = await (get(query(reference, orderByChild("channelId"), equalTo(channelId))));

        snap.forEach(s => {
            data = s.val();
        })

        if (!data.users.includes(userId)) {
            data.users.push(userId);
        }

        await set(ref(this.rdb, `channels/${data.channelId}`), data)
        return data;
    }



    async setChannel({ name, owner }: { name: string, owner: string }) {
        const reference = ref(this.rdb, `channels`);

        const channelData: DbChannel = {
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
}


export default ChannelsDb;