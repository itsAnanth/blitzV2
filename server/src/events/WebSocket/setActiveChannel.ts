import Message from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";

export default new WsEvent({
    messageType: Message.types.SET_ACTIVE_CHANNEL,
    async callback(ws, message) {
        const userId = ws.id;
        const user = this.users.get(userId);

        const previousChannel = this.channels.get(user.activeChannel);

        if (previousChannel)
            previousChannel.users.splice(previousChannel.users.indexOf(userId));

        user.activeChannel = message.data[0].channelId;

        const currentChannel = this.channels.get(user.activeChannel);

        currentChannel.users.push(userId)

        console.log("SETTING ACTIVE CHANNEL", this.users.get(userId).activeChannel)


        ws.send(new Message({
            type: Message.types.SET_ACTIVE_CHANNEL,
            data: [{ channelId: message.data[0].channelId }]
        }).encode())
    },
})