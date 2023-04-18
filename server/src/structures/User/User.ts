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
        // publicKeyJwk,
        id
    }: {
        username: string,
        socket: connection,
        avatar: number,
        // publicKeyJwk: JsonWebKey,
        id: string;
    }) {
        super();
        this.username = username;
        this.socket = socket;
        this.avatar = avatar;
        // this.publicKeyJwk = publicKeyJwk;
        this.id = id;
        this.activeChannel = null;
    }
}

export default ServerUser;