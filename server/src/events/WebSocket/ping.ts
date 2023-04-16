import Message from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";

export default new WsEvent({
    messageType: Message.types.PING,
    async callback(_ws, message) {
        console.log(message.data);
    },
})