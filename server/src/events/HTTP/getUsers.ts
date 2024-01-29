import HttpEvent from "../../structures/Events/HttpEvent";

export default new HttpEvent({
    route: '/users',
    method: HttpEvent.types.GET,
    callback(req, res, _next) {

        const channelId = req.query.channelId;

        if (!channelId || typeof channelId != 'string') return res.send('invalid params');

        const channel = this.WsServer.channels.get(channelId);

        if (!channel) return res.send('invalid channel');

        const data: { [id: string]: any } = {};

        for (let i = 0; i < channel.users.length; i++) {
            const serialized = this.WsServer.users.get(channel.users[i]).serialize();
            const id = serialized.id;
            delete serialized.id;
            data[id] = (serialized);
        }



        res.send(data);

        return true;
    },
})