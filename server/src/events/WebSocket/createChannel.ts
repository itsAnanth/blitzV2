import Message, { DataTypes } from "../../../../shared/Message";
import { DbChannel, channelsDb } from '../../../../database';
import WsEvent from "../../structures/Events/WsEvent";
import Channel from "../../structures/Channel/Channel";
import { getMessageId } from "../../utils";


export default new WsEvent<DataTypes.Client.CREATE_CHANNEL>({
    messageType: Message.types.CREATE_CHANNEL,
    async callback(ws, message) {
        console.log(message)

        const channelName = message.data[0].channelName;
        const ownerId = message.data[0].owner;
        const channelData: DbChannel = await channelsDb.setChannel({ name: channelName, owner: ownerId })

        const serverChannel = new Channel({
            name: channelData.name,
            id: channelData.channelId
        });

        serverChannel.users.push(ws.id)

        this.channels.set(serverChannel.id, serverChannel);

        ws.send(new Message({
            type: Message.types.CREATE_CHANNEL,
            data: [channelData]
        }).encode())


        serverChannel.broadCast(this.users, new Message<DataTypes.Server.MESSAGE_CREATE>({
            type: Message.types.MESSAGE_CREATE,
            data: [{
                content: `Channel created`,
                author: 'bot',
                recipient: serverChannel.id,
                timestamp: Date.now(),
                messageId: getMessageId()
            }]
        }))
    },
})