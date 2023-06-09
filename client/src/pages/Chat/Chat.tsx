import { ChatContainer, ChatContent, ChatDiv, ChatHeader, ChatHeaderBrand, ChatMain, ChatMainContent, ChatMainForm, ChatMainFormSend, ChatSidebar, ChatSidebarContainer, ChatSidebarContent, User, UserAvatar, UsersContainer } from "./Chat.styled";
import { ChatMessage } from "../../components";
import { AiOutlineSend } from 'react-icons/ai';
import { useContext, useState, useEffect, useRef } from "react";
import { WebSocketContext } from "../../contexts/websocket.context";
import Message, { DataTypes } from "../../../../shared/Message";
import { isCustomEvent } from "../../utils";
import { useNavigate } from "react-router-dom";
import { FireBaseContext } from "../../contexts/firebase.context";
import { LoaderContext } from "../../contexts/loader.context";

function Chat() {
    const authContext = useContext(FireBaseContext);
    const navigate = useNavigate();
    let user = authContext.user;
    const formContainerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLInputElement>(null);
    const chatMainRef = useRef<HTMLDivElement>(null);
    type messageType = DataTypes.Server.MESSAGE_CREATE[0];
    const [message, setMessage] = useState<messageType[]>([]);
    const wsm = useContext(WebSocketContext);
    const [channels, setChannels] = useState<DataTypes.Server.GET_CHANNELS>([]);
    const [users, setUsers] = useState();
    const loaderContext = useContext(LoaderContext);

    const [currentChannel, setCurrentChannel] = useState<string | null>(null);
    // useEffect(() => {
    //     fetch('http://localhost:3000/channels')
    //         .then(res => res.json())
    //         .then(val => setChannels(val));
    // }, [])

    useEffect(() => {

        loaderContext.setLoader(false);
        initChat();

    }, []);

    useEffect(() => {
        chatMainRef.current?.scrollTo({ 'top': chatMainRef.current.scrollHeight });
    });

    useEffect(() => {
        
        wsm.addEventListener(Message.types[Message.types.MESSAGE_CREATE], ev => {
            if (!isCustomEvent(ev)) return;


            const data: DataTypes.Server.MESSAGE_CREATE = ev.detail;


            setMessage([...message, data[0]]);

        });
    }, [message]);



    function initChat() {


        if (!authContext.user) return navigate('/signup');


        // textRef.current?.addEventListener('input', () => {
        //     if (!textRef.current || !formContainerRef.current) return;
        //     // @ts-ignore
        //     window.t = textRef.current



        //     formContainerRef.current.style.height = `${textRef.current?.scrollHeight}px`;
        //     textRef.current.style.height = `80%`;

        // })

        if (!wsm._open) {
            wsm.connect();

        }


        wsm.addEventListener('wsopen', () => {
            user = authContext.user;

            console.log('ws open');

            wsm.send(new Message<DataTypes.Client.USER_JOIN>({
                type: Message.types.USER_JOIN,
                // @ts-ignore
                data: [{ username: user.displayName || 'unknown user', userId: user.uid, avatar: 0 }]
            }))
        })

        wsm.addEventListener(Message.types[Message.types.USER_JOIN], ev => {
            setCurrentChannel('123456');

            wsm.send(new Message<DataTypes.Client.JOIN_CHANNEL>({
                type: Message.types.JOIN_CHANNEL,
                data: [{ channelId: currentChannel || '123456' }]
            }))
        });
    }


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

    return (
        <>
            {/* <Loader active={loaderActive} /> */}
            {/* {user ? */}
                <ChatDiv>
                    <ChatContainer>
                        <ChatHeader>
                            <ChatHeaderBrand>Blitz App</ChatHeaderBrand>
                        </ChatHeader>

                        <ChatContent>
                            <ChatSidebar>

                                {/* <UsersContainer><User><UserAvatar></UserAvatar></User></UsersContainer> */}
                                {channels.map((item, i) =>
                                    <ChatSidebarContainer
                                        key={i}
                                        onClick={() => joinChannel(i)}
                                    >
                                        <ChatSidebarContent className={currentChannel == channels[i].id ? 'active' : ''}>{item.name}</ChatSidebarContent>
                                    </ChatSidebarContainer>)}
                            </ChatSidebar>
                            <ChatMain>
                                <ChatMainContent ref={chatMainRef}>
                                    {message.map((item, i) => (
                                        <ChatMessage
                                            author={item.authorUsername}
                                            content={item.content}
                                            timestamp={new Date(Date.now()).toLocaleDateString()}
                                            key={i}
                                        />
                                    ))}
                                </ChatMainContent>
                                <ChatMainForm ref={formContainerRef}>

                                    <form onSubmit={sendMessage}>
                                        <input
                                            ref={textRef}
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
                {/* : <Navigate to={'/signup'} />} */}
        </>
    )
}

export default Chat;