import Message from "../../../../shared/Message";
import User from "../User/User";
import WsServer from "../WsServer";

class Channel {

    members: string[];
    id: string;
    name: string;

    constructor({ id, name }: { name: string, id: string }) {
        this.id = id;
        this.members = [];
        this.name = name;
    }

    addUser(userId: string) {
        this.members.push(userId);
    }

    removeUser(userId: string) {
        this.members.splice(this.members.indexOf(userId), 1);
    }

    getUsers(users: WsServer['users']) {
        const res: ReturnType<User['serialize']>[] = [];
        for (let i = 0; i < this.members.length; i++) {
            const user = users.get(this.members[i]);

            if (!user) continue;
            res.push(user.serialize());
            
        }

        return res;
    }

    broadCast(users: WsServer['users'], message: Message) {
        for (let i = 0; i < this.members.length; i++) {
            const user = users.get(this.members[i]);

            console.log(user.id);

            if (!user) continue;

            user.socket.send(message.encode());

        }
    }

    serialize() {
        return {
            name: this.name,
            id: this.id
        }
    }
}

export default Channel;