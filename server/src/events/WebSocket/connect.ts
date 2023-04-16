import Message from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";

export default new WsEvent({
    messageType: Message.types.CONNECT,
    async callback(_ws, _message) {
        _ws.send(new Message({
            type: Message.types.CONNECT,
            data: ['fuc lmao']
        }).encode())
    },
})