import Message from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";
import ServerUser from "../../structures/User/User";

export default new WsEvent({
    messageType: Message.types.HANDSHAKE,
    async callback(ws, _message) {


        const data = _message.data[0];

        ws.id = data.userId;

        if (!this.users.has(data.userId)) {

            const user = new ServerUser({
                id: data.userId,
                socket: ws
            });
            this.users.set(ws.id, user);

        }


        ws.send(new Message({
            type: Message.types.HANDSHAKE,
            data: ['handshake confirmed']
        }).encode())
    },
})