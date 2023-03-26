import HttpEvent from "../../structures/Events/HttpEvent";

export default new HttpEvent({
    route: '/',
    method: HttpEvent.types.GET,
    async callback(_req, res) {
        res.send('reached');
    },
})