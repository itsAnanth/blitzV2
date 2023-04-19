import { useNavigate } from "react-router-dom";
import Message, { DataTypes } from "../../../../shared/Message";
import { WebSocketContext } from "../../contexts/websocket.context";
import WsManager from "../../structures/WsManager";
import { useContext } from 'react';
import { ReactReduxContext } from "react-redux/es/exports";

function Test() {

    const wsm = useContext(WebSocketContext);
    const navigate = useNavigate();

    console.log(useContext(ReactReduxContext).store.getState());

    function getRandomId() {
        const a = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
        let b = '';
        for (let i = 0; i < 8; i++) {
            b += a[Math.floor(Math.random() * a.length)];
        }
        return b;
    }

    function connect() {
        wsm.connect();
    }

    function join() {
        wsm.send(
            new Message<DataTypes.Client.USER_JOIN>({
                type: Message.types.USER_JOIN,
                data: [{ username: 'test', userId: getRandomId(), avatar: 0 }]
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
            new Message<DataTypes.Client.MESSAGE_CREATE>({
                type: Message.types.MESSAGE_CREATE,
                data: [{ content: ev.target.content.value, recipient: '123456' }]
            }).encode()
        )
    }
    return (
        <>
            <button onClick={() => navigate('/chat')}>Chat</button>
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