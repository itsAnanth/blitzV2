import { ChannelDiv, ChannelsContainer, ChatContainer, ChatContent, ChatDiv, ChatHeader, ChatHeaderBrand, ChatMain, ChatMainContent, ChatMainForm, ChatMainFormSend, ChatMainFormUploadBtn, ChatSidebar, ChatSidebarContainer, ChatSidebarContent, LogoutDiv, User, UserAvatar, UserDetail, UsersContainer } from "./Chat.styled";
import { ChatMessage } from "../../components";
import { AiOutlineSend } from 'react-icons/ai';
import { useContext, useState, useEffect, useRef } from "react";
import { WebSocketContext } from "../../contexts/websocket.context";
import Message, { DataTypes } from "../../../../shared/Message";
import { Logger, isCustomEvent } from "../../utils";
import { useNavigate } from "react-router-dom";
import { FireBaseContext } from "../../contexts/firebase.context";
import { LoaderContext } from "../../contexts/loader.context";
import { CiLogout, CiCirclePlus } from 'react-icons/ci'
import AccountManager from "../../structures/AccountManager";
import Db from "../../structures/Db";
import ChannelCreate from "./ChannelCreate/ChannelCreate";

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
    const [users, setUsers] = useState<({ username: string, avatar: number, id: string })[]>([]);
    const loaderContext = useContext(LoaderContext);
    const [channelDialog, setChannelDialog] = useState(false)

    const [currentChannel, setCurrentChannel] = useState<string | null>(null);

    useEffect(() => {

        initChat();

    }, []);

    useEffect(() => {
        if (authContext.user === null) navigate('/')
    }, [authContext.user])

    useEffect(() => {
        console.log(users)
    }, [users])

    useEffect(() => {
        chatMainRef.current?.scrollTo({ 'top': chatMainRef.current.scrollHeight });
    }, [message]);

    useEffect(() => {

        const messageCreate = (ev: any) => {
            if (!isCustomEvent(ev)) return;


            const data: DataTypes.Server.MESSAGE_CREATE = ev.detail;


            setMessage([...message, data[0]]);


        }

        wsm.addEventListener(Message.types[Message.types.MESSAGE_CREATE], messageCreate);

        return () => wsm.removeEventListener(Message.types[Message.types.MESSAGE_CREATE], messageCreate);
    }, [message]);

    async function getUsers() {
        const res = await fetch('http://localhost:3000/users?channelId=123456');
        const val = await res.json();
        setUsers({ ...val });

        console.log(users, 'GETUSERS');

    }




    function initChat() {


        if (!authContext.user) return navigate('/signup');


        // textRef.current?.addEventListener('input', () => {
        //     if (!textRef.current || !formContainerRef.current) return;
        //     // @ts-ignore
        //     window.t = textRef.current



        //     formContainerRef.current.style.height = `${textRef.current?.scrollHeight}px`;
        //     textRef.current.style.height = `80%`;

        // })



        wsm.addEventListener('wsopen', userJoin);




        wsm.addEventListener(Message.types[Message.types.JOIN_CHANNEL], joinChannelEvent)

        wsm.addEventListener(Message.types[Message.types.USER_JOIN], userJoinEvent);

        if (!wsm._open) {
            wsm.connect();

        }
    }

    const joinChannelEvent = async (ev: any) => {
        if (!isCustomEvent(ev)) return;

        loaderContext.setLoaderText("Fetching Messages...")

        const msg: DataTypes.Server.JOIN_CHANNEL = ev.detail;
        console.log('JOIN CHANNLE', msg)

        setUsers(msg);

        // const data: any[] = await (await fetch('http://localhost:3000/messages?channelId=12345')).json() //Db.getMessages('12345');
        const data = await Db.getMessages('12345')
        console.log("getting data from db", data)
        setMessage([...message, ...data])
        loaderContext.setLoader(false)

        loaderContext.setLoaderText("")

        // getUsers();
    }

    const userJoinEvent = () => {
        setCurrentChannel('12345');

        wsm.send(new Message<DataTypes.Client.JOIN_CHANNEL>({
            type: Message.types.JOIN_CHANNEL,
            data: [{ channelId: currentChannel || '12345' }]
        }))
    }


    const sendMessage = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (!authContext.user) return Logger.error('user undefined on send message');

        if (!currentChannel) return console.error('Invalid current channel');
        const target: any = ev.target;


        wsm.send(
            new Message<DataTypes.Client.MESSAGE_CREATE>({
                type: Message.types.MESSAGE_CREATE,
                data: [{ content: target.message.value, recipient: currentChannel, author: authContext.user?.uid }]
            }).encode()
        )

        target.message.value = '';
    }

    const userJoin = () => {
        user = authContext.user;

        console.log('ws open');

        wsm.send(new Message<DataTypes.Client.USER_JOIN>({
            type: Message.types.USER_JOIN,
            // @ts-ignore
            data: [{ username: user.displayName || 'unknown user', userId: user.uid, avatar: Math.floor(Math.random() * 50) }]
        }))
    }

    const signOut = () => {
        AccountManager.signOut();
        wsm.disconnect();
        setUsers([]);
        setMessage([]);

        wsm.removeEventListener('wsopen', userJoin);
        wsm.removeEventListener(Message.types[Message.types.JOIN_CHANNEL], joinChannelEvent);
        wsm.removeEventListener(Message.types[Message.types.USER_JOIN], userJoinEvent);

    }



    // const joinChannel = (i: number) => {
    //     const channel = channels[i];

    //     setCurrentChannel(channel.id);

    //     wsm.send(new Message<DataTypes.Client.JOIN_CHANNEL>({
    //         type: Message.types.JOIN_CHANNEL,
    //         data: [{ channelId: channel.id }]
    //     }))
    // }

    return (
        <>
            {/* <Loader active={loaderActive} /> */}
            {/* {user ? */}
            <ChannelCreate channelDialog={channelDialog} setChannelDialog={setChannelDialog} />
            
            <ChatDiv>
                <ChatContainer>
                    <ChatHeader>
                        <ChatHeaderBrand>Blitz App</ChatHeaderBrand>
                        <LogoutDiv onClick={() => signOut()}>
                            <CiLogout />
                        </LogoutDiv>
                    </ChatHeader>

                    <ChatContent>
                        <ChatSidebar width={18}>
                            <ChannelsContainer>
                                <ChannelDiv onClick={() => setChannelDialog(true)}>
                                    <CiCirclePlus style={{ fontSize: '1.5rem' }} />
                                    Create Channel
                                </ChannelDiv>
                            </ChannelsContainer>


                            {/* {channels.map((item, i) =>
                                    <ChatSidebarContainer
                                        key={i}
                                        onClick={() => joinChannel(i)}
                                    >
                                        <ChatSidebarContent className={currentChannel == channels[i].id ? 'active' : ''}>{item.name}</ChatSidebarContent>
                                    </ChatSidebarContainer>)} */}
                        </ChatSidebar>
                        <ChatMain>
                            <ChatMainContent ref={chatMainRef}>
                                {message.map((item, i) => (
                                    <ChatMessage
                                        avatar={0}
                                        author={item.author}
                                        content={item.content}
                                        timestamp={new Date(Date.now()).toLocaleDateString()}
                                        key={i}
                                    />
                                ))}
                            </ChatMainContent>
                            <ChatMainForm ref={formContainerRef}>

                                <form onSubmit={sendMessage}>
                                    <ChatMainFormUploadBtn>
                                        <CiCirclePlus />
                                    </ChatMainFormUploadBtn>

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
                        <ChatSidebar width={22}>

                            <UsersContainer>{
                                users.map(user => {
                                    return (
                                        <User><UserAvatar src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.avatar}`}></UserAvatar><UserDetail>{user.username}</UserDetail></User>
                                    )
                                })
                            }
                            </UsersContainer>
                        </ChatSidebar>
                    </ChatContent>
                </ChatContainer>
            </ChatDiv>
            {/* : <Navigate to={'/signup'} />} */}
        </>
    )
}

export default Chat;