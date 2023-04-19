import { readdirSync } from 'fs';
import express from 'express';
import type { Express } from 'express';
import { HttpTypes } from '../../../shared/HTTP';
import HttpEvent from './Events/HttpEvent';
import { createServer } from 'http';
import { httpTypeArray } from '../../../shared/HTTP/HttpTypes';
import Logger from '../utils/Logger';
import cors from 'cors';
import WsServer from './WsServer';

class HttpServer {
    app: Express;
    WsServer: WsServer;
    // { GET: { 'routepath': Event } }
    events: Map<HttpTypes, Map<string, HttpEvent>>
    server: ReturnType<typeof createServer>;
    PORT: number;

    constructor(PORT: number = 3000) {
        this.PORT = PORT;
        this.events = new Map();
        this.WsServer = null;

        for (let i = 0; i < httpTypeArray.length; i++)
            this.events.set(i, new Map())
    }

    async init() {
        const eventsPath = readdirSync('./src/events/HTTP');

        if (eventsPath.length === 0)
            return Logger.log("Empter server events");

        for (let i = 0; i < eventsPath.length; i++) {
            const event = (await import(`../events/HTTP/${eventsPath[i]}`)).default as HttpEvent;

            const eventType = this.events.get(event.method);

            if (eventType.has(event.route)) continue;

            eventType.set(event.route, event);
        }

        Logger.log(`[HTTP_SERVER]`, this.events)
    }

    setWsServer(server: WsServer) {
        this.WsServer = server;
    }

    start() {
        this.app = express();

        this.app.use(cors())

        for (const [method, event] of this.events.entries()) {
            for (const [route, eventHandler] of event.entries()) {

                const _method: 'get' | 'post' | 'put' | 'delete' = HttpTypes[method].toLowerCase() as any;

                this.app[_method](route, eventHandler.callback.bind(this));
            }
        }

        this.app.use(cors());
        this.server = createServer(this.app);
        this.server.listen(this.PORT, () => Logger.log(`[HTTP_SERVER] Listening on PORT ${this.PORT}`));
    }
}

export default HttpServer;