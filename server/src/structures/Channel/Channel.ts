import { Console } from "console";
import ChatMessage from "../../../../shared/ChatMessage/ChatMessage";
import Message, { DataTypes } from "../../../../shared/Message";
import Db from "../../database/Db";
import User from "../User/User";
import WsServer from "../WsServer";

class Channel {

    users: string[];
    id: string;
    name: string;

    _lastUpdate: number;
    _cacheFlush: number;

    constructor({ id, name, users }: { name: string, id: string, users?: string[] }) {
        this.id = id;
        this.users = users ?? [];
        this.name = name;
    }

    addUser(userId: string) {
        this.users.push(userId);
    }

    removeUser(userId: string) {
        this.users.splice(this.users.indexOf(userId), 1);
    }

    getUsers(users: WsServer['users']) {
        const res: ReturnType<User['serialize']>[] = [];
        for (let i = 0; i < this.users.length; i++) {
            const user = users.get(this.users[i]);

            if (!user) continue;
            res.push(user.serialize());
            
        }

        return res;
    }

    broadCast(users: WsServer['users'], message: Message) {
        for (let i = 0; i < this.users.length; i++) {
            const user = users.get(this.users[i]);

            console.log(user.id);

            if (!user) continue;

            user.socket.send(message.encode());

        }

        if (message.type === Message.types.MESSAGE_CREATE) {
            Db.setMessage(this.id, message.data[0])
        }
    }

    serialize(users: WsServer['users']) {
        console.log("server users", this.users)
        console.log("serialize self users", this.users)
        console.log("serialize", this.getUsers(users))
        return {
            name: this.name,
            id: this.id,
            users: this.getUsers(users)
        }
    }

    serializeDb(): { name: string, id: string, users: any[] } {
        return {
            name: this.name,
            id: this.id,
            users: []
        }
    }
}

export default Channel;