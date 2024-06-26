import Message, { DataTypes } from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";
import Channel from "../../structures/Channel/Channel";
import ServerUser from "../../structures/User/User";
import { getMessageId } from "../../utils";
import { channelsDb, usersDb } from "../../../../database";

export default new WsEvent<DataTypes.Client.JOIN_CHANNEL>({
    messageType: Message.types.JOIN_CHANNEL,
    async callback(ws, _message) {
        const data = _message.data[0];
        const channelId = data.channelId;
        const user = this.users.get(ws.id);

        // console.log("??????")
        // console.log(channelId, this.channels)

        let channel = this.channels.get(channelId);

        // if (!channel) {
        //     channel = new Channel({ id: channelId, name: 'test' });
        //     this.channels.set(channelId, channel);
        // }

        // if (user.activeChannel) {
        //     let usersChannel = this.channels.get(user.activeChannel);
        //     usersChannel.users.splice(usersChannel.users.indexOf(user.id), 1);
        // }

        // user.activeChannel = channel.id;

        // channel.addUser(ws.id);

        const userData = await usersDb.getUser(user.id);

        await channelsDb.addUserToChannel(channelId, user.id)

        channel.addUser(user.id)

        channel.broadCast(this.users, new Message<DataTypes.Server.MESSAGE_CREATE>({
            type: Message.types.MESSAGE_CREATE,
            data: [{ content: `${userData.username} has joined the chat!`, recipient: channelId, author: 'bot', 'messageId': getMessageId(), timestamp: Date.now()}]
        }));

        channel.broadCast(this.users, new Message({
            type: Message.types.USER_JOIN,
            data: [userData]
        }), [userData.userId])

        ws.send(new Message({
            type: Message.types.JOIN_CHANNEL,
            data: [{ channelId: channelId }]
        }).encode());

        console.log('JOIN CHANNEL, MEMBERS ', channel.users)


        // channel.broadCast(this.users, new Message<DataTypes.Server.JOIN_CHANNEL>({
        //     type: Message.types.JOIN_CHANNEL,
        //     data: channel.getUsers(this.users)
        // }))

        

        
        // console.log(`User joined channel ${channel.id}`, channel.users);
        
    },
})