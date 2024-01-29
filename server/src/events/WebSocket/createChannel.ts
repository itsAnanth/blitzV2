import Message from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";

export default new WsEvent({
    messageType: Message.types.CREATE_CHANNEL,
    async callback(ws, message) {
        
    },
})