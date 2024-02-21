import Message from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";

export default new WsEvent({
    messageType: Message.types.GET_CHANNEL,
    async callback(ws, message) {
        const channelId = message.data[0];

        console.log("msg incoming")
        ws.send(
            new Message({
                type: Message.types.GET_CHANNEL,
                data: [this.channels.get(channelId).serialize(this.users)]
            })
        )
    },
})