import Message, { DataTypes } from "../../../../shared/Message";
import WsManager from "../../structures/WsManager";
import { useContext } from 'react';
import { ReactReduxContext } from "react-redux/es/exports";

function Test() {

    const wsm = new WsManager();

    console.log(useContext(ReactReduxContext).store.getState());

    function connect() {
        wsm.connect();
    }

    function join() {
        wsm.send(
            new Message<DataTypes.Client.USER_JOIN>({
                type: Message.types.USER_JOIN,
                data: [{ username: 'test', userId: '123', avatar: 0 }]
            })
        )
    }

    function joinRoom() {
        wsm.send(
            new Message<DataTypes.Client.JOIN_CHANNEL>({
                type: Message.types.JOIN_CHANNEL,
                data: [{ channelId: '123456' }]
            })
        )
    }

    function onSubmit(ev: any) {
        ev.preventDefault();

        console.log(ev.target.content.value);

        wsm.send(
            new Message({
                type: Message.types.MESSAGE_CREATE,
                data: [{ content: ev.target.content.value }]
            }).encode()
        )
    }
    return (
        <>
            <button onClick={connect}>Connect</button>
            <button onClick={join}>Join</button>
            <button onClick={joinRoom}>Join Room</button>
            <form onSubmit={onSubmit}>
                <input type="text" name="content"></input>
                <button type="submit">send</button>
            </form>
        </>
    )
}

export default Test;