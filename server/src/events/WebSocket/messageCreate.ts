import ChatMessage from "../../../../shared/ChatMessage/ChatMessage";
import Message, { DataTypes } from "../../../../shared/Message";
import Db from "../../database/Db";
// import db from "../../database/Main";
import WsEvent from "../../structures/Events/WsEvent";
import { getMessageId } from "../../utils";

export default new WsEvent<DataTypes.Client.MESSAGE_CREATE>({
    messageType: Message.types.MESSAGE_CREATE,
    async callback(ws, _message) {

        const user = this.users.get(ws.id);

        if (!user) return console.error('no user');

        const room = this.channels.get(user.activeChannel);

        if (!room) return console.error('no active room');

        const messageData: ChatMessage = {
            messageId: getMessageId(),
            author: _message.data[0].author,
            timestamp: Date.now(),
            recipient: _message.data[0].recipient,
            content: _message.data[0].content
        }


        const message = new Message<DataTypes.Server.MESSAGE_CREATE>({
            type: Message.types.MESSAGE_CREATE,
            data: [{ ...(messageData) }]
        });

        console.log(`Message Length ${message.encode().length}`);

        // await db.setMessage(message.data[0].messageId, message.encode())
        room.broadCast(this.users, message);
    },
})