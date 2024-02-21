import HttpEvent from "../../structures/Events/HttpEvent";

export default new HttpEvent({
    route: '/channels',
    method: HttpEvent.types.GET,
    callback(_req, res, _next) {
        res.send([...this.WsServer.channels.values()].map(x => x.serialize(this.WsServer.users)));
    },
})