import { connection } from "websocket";
import User from "../../../../shared/User/User";
import { JsonWebKey } from 'crypto';

class ServerUser extends User {

    socket: connection;
    activeChannel: null | string;


    constructor({
        username,
        socket,
        avatar,
        id
    }: {
        username: string,
        socket: connection,
        avatar: number,
        id: string;
    }) {
        super();
        this.username = username;
        this.socket = socket;
        this.avatar = avatar;
        this.id = id;
        this.activeChannel = null;
    }


    serialize() {
        return {
            username: this.username,
            avatar: this.avatar,
            id: this.id
        }
    }
}

export default ServerUser;