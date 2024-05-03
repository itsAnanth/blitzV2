import { Database, equalTo, get, orderByChild, query, ref, set } from "firebase/database";
import { User } from 'firebase/auth';
import { DbUser } from "./users.schema";
import { DbChannel } from "../channels/channels.schema";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

class UsersDb {

    rdb: Database;

    constructor(rdb: Database) {
        this.rdb = rdb;


    }

    async setDbUser(user: DbUser) {
        await set(ref(this.rdb, `users/${user.userId}`), user);
    }

    async setUser(user: User, deleteUser: boolean = false) {
        const userData: DbUser = {
            userId: user.uid,
            channels: [],
            photoURL: user.photoURL,
            timestamp: Date.now(),
            username: user.displayName
        }



        await set(ref(this.rdb, `users/${user.uid}`), deleteUser ? null : userData);

        // const listRef = ref(rdb, `users/${userid}`)
    }



    async getUser(user: User | string): Promise<DbUser | null> {
        const reference = ref(this.rdb, `users`);
        let data: DbUser;

        const snap = await get(query(reference, orderByChild('userId'), equalTo(typeof user === 'string' ? user : user.uid)))

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
        const channels: DbChannel[] = [];
        snap.forEach(s => {
            data = s.val();
        })

        console.log("get channels in user", data)

        if (!data || !data.channels) return channels;

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

    async uploadProfilePicture(file: File, userId: string) {
        const storage = getStorage();
        const fileRef = storageRef(storage, `profile_pictures/${userId}.png`);


        const snapshot = await uploadBytes(fileRef, file);
        const photoURL = await getDownloadURL(fileRef);


        return photoURL;
    }

    async updateUser(user: DbUser) {
        await set(ref(this.rdb, `users/${user.userId}`), user);
    }

}

export default UsersDb;