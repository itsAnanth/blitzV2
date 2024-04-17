import Message, { DataTypes } from "../../../../shared/Message";
import { DbChannel, channelsDb } from '../../../../database';
import WsEvent from "../../structures/Events/WsEvent";
import Channel from "../../structures/Channel/Channel";


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
        })

        this.channels.set(serverChannel.id, serverChannel);

        ws.send(new Message({
            type: Message.types.CREATE_CHANNEL,
            data: [channelData]
        }).encode())
    },
})