import { connection } from "websocket";

class ServerUser {

    id: string;
    socket: connection;
    activeChannel: null | string;


    constructor({
        socket,
        id
    }: {
        socket: connection,
        id: string;
    }) {
        this.socket = socket;
        this.id = id;
        this.activeChannel = null;
    }


    setActiveChannel(channelId: string) {
        this.activeChannel = channelId;
    }


    serialize() {
        return {
            id: this.id
        }
    }
}

export default ServerUser;