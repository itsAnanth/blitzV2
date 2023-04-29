import Message from "../../../../shared/Message";
import db from "../../database/Main";
import HttpEvent from "../../structures/Events/HttpEvent";

export default new HttpEvent({
    route: '/messages',
    method: HttpEvent.types.GET,
    async callback(_req, _res, _next) {
        const msgCount = _req.query.count;
        const messages = await db.getMessage();
        const mArray = Object.values(messages).slice(0, typeof msgCount === 'string' ? parseInt(msgCount) : 20);
        const dArray = [];
        for (let i = 0; i < mArray.length; i++) 
            dArray.push(Message.decode(mArray[i]).data)

        // console.log(dArray);
        _res.send(dArray);
    },
})