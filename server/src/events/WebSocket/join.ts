import Message, { DataTypes } from "../../../../shared/Message";
import WsEvent from "../../structures/Events/WsEvent";
import ServerUser from "../../structures/User/User";

export default new WsEvent<DataTypes.Client.USER_JOIN>({
    messageType: Message.types.USER_JOIN,
    async callback(_ws, _message) {
        // const data = _message.data[0];

        // ws.id = data.userId;

        // if (!this.users.has(data.userId)) {

        //     const user = new ServerUser({
        //         username: data.username,
        //         id: data.userId,
        //         avatar: data.avatar,
        //         socket: ws
        //     });
        //     this.users.set(ws.id, user);

        // }


        // ws.send(new Message({
        //     type: Message.types.USER_JOIN,
        //     data: [{ status: 'authenticated' }]
        // }).encode())

        // console.log('current users', [...this.users.keys()]);
    },
})