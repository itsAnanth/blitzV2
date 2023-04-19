import Message, { DataTypes } from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";
import { getMessageId } from "../../utils";

export default new WsEvent<DataTypes.Client.MESSAGE_CREATE>({
    messageType: Message.types.MESSAGE_CREATE,
    async callback(ws, _message) {

        const user = this.users.get(ws.id);

        if (!user) return console.error('no user');

        const room = this.channels.get(user.activeChannel);

        if (!room) return console.error('no active room');


        room.broadCast(this.users, new Message({
            type: Message.types.MESSAGE_CREATE,
            data: [{ ...(_message.data[0]), messageId: getMessageId(), authorId: user.id, authorUsername: user.username }]
        }));
    },
})