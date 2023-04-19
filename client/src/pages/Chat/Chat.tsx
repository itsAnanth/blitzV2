import { ChatContainer, ChatContent, ChatDiv, ChatHeader, ChatMain, ChatMainContent, ChatMainForm, ChatMainFormSend, ChatSidebar } from "./Chat.styled";
import { ChatMessage } from "../../components";
import { AiOutlineSend } from 'react-icons/ai';
import { useContext, useState } from "react";
import { WebSocketContext } from "../../contexts/websocket.context";
import Message, { DataTypes } from "../../../../shared/Message";
import { isCustomEvent } from "../../utils";

function Chat() {

    type messageType = DataTypes.Server.MESSAGE_CREATE[0];
    const [message, setMessage] = useState<messageType[]>([]);
    const wsm = useContext(WebSocketContext);

    wsm.addEventListener(Message.types[Message.types.MESSAGE_CREATE], ev => {
        if (!isCustomEvent(ev)) return;

        const data: DataTypes.Server.MESSAGE_CREATE = ev.detail;

        setMessage([...message, data[0]]);
    });

    const messages = message.map((item, i) => (
        <ChatMessage
            author={item.authorId}
            content={item.content}
            timestamp={new Date(Date.now()).toLocaleDateString()}
        />
    ))
    return (
        <ChatDiv>
            <ChatContainer>
                <ChatHeader />
                <ChatContent>
                    <ChatSidebar></ChatSidebar>
                    <ChatMain>
                        <ChatMainContent>
                            {messages}
                        </ChatMainContent>
                        <ChatMainForm>
                            <form>
                                <textarea
                                    placeholder="Message"
                                    name="message"
                                    autoComplete="off"
                                />
                                <ChatMainFormSend><AiOutlineSend /></ChatMainFormSend>
                            </form>
                        </ChatMainForm>
                    </ChatMain>
                </ChatContent>
            </ChatContainer>
        </ChatDiv>
    )
}

export default Chat;