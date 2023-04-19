import { ChatContainer, ChatContent, ChatDiv, ChatHeader, ChatMain, ChatMainContent, ChatMainForm, ChatMainFormSend, ChatSidebar, ChatSidebarContainer, ChatSidebarContent } from "./Chat.styled";
import { ChatMessage } from "../../components";
import { AiOutlineSend } from 'react-icons/ai';
import { useContext, useState, useEffect } from "react";
import { WebSocketContext } from "../../contexts/websocket.context";
import Message, { DataTypes } from "../../../../shared/Message";
import { isCustomEvent } from "../../utils";

function Chat() {

    const [channels, setChannels] = useState<DataTypes.Server.GET_CHANNELS>([]);

    const [currentChannel, setCurrentChannel] = useState<string | null>(null);
    useEffect(() => {
        fetch('http://localhost:3000/channels')
            .then(res => res.json())
            .then(val => setChannels(val));
    }, [])




    type messageType = DataTypes.Server.MESSAGE_CREATE[0];
    const [message, setMessage] = useState<messageType[]>([]);
    const wsm = useContext(WebSocketContext);

    wsm.addEventListener(Message.types[Message.types.MESSAGE_CREATE], ev => {
        if (!isCustomEvent(ev)) return;

        const data: DataTypes.Server.MESSAGE_CREATE = ev.detail;

        setMessage([...message, data[0]]);
    });


    const sendMessage = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (!currentChannel) return console.error('Invalid current channel');
        const target: any = ev.target;


        wsm.send(
            new Message<DataTypes.Client.MESSAGE_CREATE>({
                type: Message.types.MESSAGE_CREATE,
                data: [{ content: target.message.value, recipient: currentChannel }]
            }).encode()
        )

        target.message.value = '';
    }

    const joinChannel = (i: number) => {
        const channel = channels[i];

        setCurrentChannel(channel.id);

        wsm.send(new Message<DataTypes.Client.JOIN_CHANNEL>({
            type: Message.types.JOIN_CHANNEL,
            data: [{ channelId: channel.id }]
        }))
    }

    const messages = message.map((item, i) => (
        <ChatMessage
            author={item.authorUsername}
            content={item.content}
            timestamp={new Date(Date.now()).toLocaleDateString()}
            key={i}
        />
    ))
    return (
        <ChatDiv>
            <ChatContainer>
                <ChatHeader />
                <ChatContent>
                    <ChatSidebar>
                        {channels.map((item, i) =>
                            <ChatSidebarContainer
                                key={i}
                                onClick={() => joinChannel(i)}
                            >
                                <ChatSidebarContent className={currentChannel == channels[i].id ? 'active' : ''}>{item.name}</ChatSidebarContent>
                            </ChatSidebarContainer>)}
                    </ChatSidebar>
                    <ChatMain>
                        <ChatMainContent>
                            {messages}
                        </ChatMainContent>
                        <ChatMainForm>
                            <form onSubmit={sendMessage}>
                                <textarea
                                    placeholder="Message"
                                    name="message"
                                    autoComplete="off"
                                />
                                <ChatMainFormSend type="submit"><AiOutlineSend /></ChatMainFormSend>
                            </form>
                        </ChatMainForm>
                    </ChatMain>
                </ChatContent>
            </ChatContainer>
        </ChatDiv>
    )
}

export default Chat;