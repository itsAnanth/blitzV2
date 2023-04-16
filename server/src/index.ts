import HttpServer from "./structures/HttpServer";
import WsServer from "./structures/WsServer";
import Logger from "./utils/Logger";

const httpServer = new HttpServer(3000);

Logger.DEV = true;

(async function () {
    await httpServer.init();
    await httpServer.start();

    const wsServer = new WsServer(httpServer.server);


    await wsServer.init();
    await wsServer.start();
})()