import Channel from "./structures/Channel/Channel";
import HttpServer from "./structures/HttpServer";
import WsServer from "./structures/WsServer";
import { config } from "dotenv";
import Logger from "./utils/Logger";

config();


import db from "./database/Main";

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

    wsServer.channels.set('123456', new Channel({ id: '123456', name: 'main' }));

    // for (let i = 0; i < 5; i++) {
    //     let temp = new Channel({ id: getChannelId(), name: 'general' });
    //     wsServer.channels.set(temp.id, temp);
    // }
    wsServer.start();

    httpServer.setWsServer(wsServer);

})();