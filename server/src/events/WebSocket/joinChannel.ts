import Message, { DataTypes } from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";
import Channel from "../../structures/Room/Room";
import ServerUser from "../../structures/User/User";

export default new WsEvent<DataTypes.Client.JOIN_CHANNEL>({
    messageType: Message.types.JOIN_CHANNEL,
    async callback(ws, _message) {
        const data = _message.data[0];
        const channelId = data.channelId;

        let channel = this.channels.get(channelId);

        if (!channel) {
            channel = new Channel({ id: channelId });
            this.channels.set(channelId, channel);
        }

        this.users.get(ws.id).activeChannel = channel.id;

        channel.addUser(ws.id);

        channel.broadCast(this.users, new Message({
            type: Message.types.JOIN_CHANNEL,
            data: [ws.id]
        }));

        console.log(this.users.get(ws.id).activeChannel);
        
    },
})