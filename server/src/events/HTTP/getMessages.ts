import { messagesDb } from "../../../../database";
import Message from "../../../../shared/Message";
import HttpEvent from "../../structures/Events/HttpEvent";

export default new HttpEvent({
    route: '/messages',
    method: HttpEvent.types.GET,
    async callback(_req, _res, _next) {
        const channelId = _req.query.channelId as string;
        const messages = await messagesDb.getMessages(channelId);
        _res.send(messages);
        // const mArray = Object.values(messages).slice(0, typeof msgCount === 'string' ? parseInt(msgCount) : 20);
        // const dArray = [];
        // for (let i = 0; i < mArray.length; i++) 
        //     dArray.push(Message.decode(mArray[i]).data)

        // // console.log(dArray);
        // _res.send(dArray);
    },
})
