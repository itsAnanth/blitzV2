import Channel from "./structures/Channel/Channel";
import HttpServer from "./structures/HttpServer";
import WsServer from "./structures/WsServer";
import { getChannelId } from "./utils";
import Logger from "./utils/Logger";

const httpServer = new HttpServer(3000);
Logger.DEV = true;

declare module 'websocket' {
    interface connection {
        id: string;
    }
}

(async function () {
    await httpServer.init();
    httpServer.start();

    const wsServer = new WsServer(httpServer.server);


    await wsServer.init();

    for (let i = 0; i < 5; i++) {
        let temp = new Channel({ id: getChannelId(), name: 'general' });
        wsServer.channels.set(temp.id, temp);
    }
    wsServer.start();

    httpServer.setWsServer(wsServer);
})();