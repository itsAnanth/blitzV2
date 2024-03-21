import Message, { DataTypes } from "../../../../shared/Message";
import Db from "../../database/Db";
import WsEvent from "../../structures/Events/WsEvent";

export default new WsEvent<DataTypes.Client.CREATE_CHANNEL>({
    messageType: Message.types.CREATE_CHANNEL,
    async callback(ws, message) {
        console.log(message)

        const channelName = message.data[0].channelName;
        const ownerId = message.data[0].owner;
        const channelData = await Db.setChannel({ name: channelName, owner: ownerId })


        ws.send(new Message({
            type: Message.types.CREATE_CHANNEL,
            data: [channelData]
        }).encode())
    },
})