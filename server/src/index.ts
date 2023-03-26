import HttpServer from "./structures/HttpServer";
import Logger from "./utils/Logger";

const httpServer = new HttpServer(3000);

Logger.DEV = true;

(async function() {
    await httpServer.init();
    httpServer.start();
})()