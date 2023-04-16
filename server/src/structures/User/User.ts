import { connection } from "websocket";
import User from "../../../../shared/User/User";

class ServerUser extends User {

    socket: connection;


    constructor({
        username,
        socket,
        avatar,
        publicKeyJwk
    }: {
        username: string,
        socket: connection,
        avatar: number,
        publicKeyJwk: JsonWebKey
    }) {
        super();
        this.username = username;
        this.socket = socket;
        this.avatar = avatar;
        this.publicKeyJwk = publicKeyJwk;
    }
}

export default ServerUser;