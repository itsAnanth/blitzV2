import Message, { DataTypes } from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";
import Channel from "../../structures/Channel/Channel";
import ServerUser from "../../structures/User/User";
import { getMessageId } from "../../utils";

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
            usersChannel.users.splice(usersChannel.users.indexOf(user.id), 1);
        }

        user.activeChannel = channel.id;

        channel.addUser(ws.id);

        channel.broadCast(this.users, new Message<DataTypes.Server.MESSAGE_CREATE>({
            type: Message.types.MESSAGE_CREATE,
            data: [{ content: `${user.username} has joined the chat!`, recipient: '12345', author: 'bot', 'messageId': getMessageId(), timestamp: Date.now()}]
        }));

        // ws.send(new Message({
        //     type: Message.types.JOIN_CHANNEL,
        //     data: ['Authorized']
        // }).encode());


        channel.broadCast(this.users, new Message<DataTypes.Server.JOIN_CHANNEL>({
            type: Message.types.JOIN_CHANNEL,
            data: channel.getUsers(this.users)
        }))

        

        
        console.log(`User joined channel ${channel.id}`, channel.users);
        
    },
})