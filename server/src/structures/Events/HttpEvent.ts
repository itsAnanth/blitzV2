import Base from "./Base";
import EventTypes from "./EventTypes";
import HttpServer from "../HttpServer";
import type { RequestHandler } from 'express';
import { HttpTypes } from "../../../../shared/HTTP";


interface Arguments {
    route: string;
    method?: HttpTypes;
    callback: (this: HttpServer, ...args: Parameters<RequestHandler>) => ReturnType<RequestHandler>;
}

class HttpEvent extends Base {

    route: string;
    method: HttpTypes;
    eventType: EventTypes.HTTP;
    callback: Arguments['callback'];
    

    static types = HttpTypes;

    constructor({ route, callback, method }: Arguments) {
        super();
        this.method = method ?? HttpTypes.GET;
        this.route = route;
        this.eventType = EventTypes.HTTP;
        this.callback = callback;
    }

}

export default HttpEvent;