import { DbMessage, messagesDb } from "../../../../database";
import Message, { DataTypes } from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";
import { getMessageId } from "../../utils";

export default new WsEvent<DataTypes.Client.MESSAGE_CREATE>({
    messageType: Message.types.MESSAGE_CREATE,
    async callback(ws, _message) {

        const user = this.users.get(ws.id);

        console.log("msg create", user.activeChannel)

        if (!user) return console.error('no user');

        const room = this.channels.get(user.activeChannel);

        if (!room) return console.error('no active room');

        const messageData: DbMessage = {
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

        room.broadCast(this.users, message);
    },
})