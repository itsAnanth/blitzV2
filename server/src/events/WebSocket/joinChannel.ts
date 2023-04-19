import Message, { DataTypes } from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";
import Channel from "../../structures/Channel/Channel";
import ServerUser from "../../structures/User/User";

export default new WsEvent<DataTypes.Client.JOIN_CHANNEL>({
    messageType: Message.types.JOIN_CHANNEL,
    async callback(ws, _message) {
        const data = _message.data[0];
        const channelId = data.channelId;
        const user = this.users.get(ws.id);

        let channel = this.channels.get(channelId);

        if (!channel) {
            channel = new Channel({ id: channelId, name: 'test' });
            this.channels.set(channelId, channel);
        }

        if (user.activeChannel) {
            let usersChannel = this.channels.get(user.activeChannel);
            usersChannel.members.splice(usersChannel.members.indexOf(user.id), 1);
        }
        
        user.activeChannel = channel.id;

        channel.addUser(ws.id);

        channel.broadCast(this.users, new Message({
            type: Message.types.JOIN_CHANNEL,
            data: [ws.id]
        }));

        
        console.log(`User joined channel ${channel.id}`, channel.members);
        
    },
})