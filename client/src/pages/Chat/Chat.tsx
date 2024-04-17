import { ChannelDiv, ChannelsContainer, ChatContainer, ChatContent, ChatDiv, ChatHeader, ChatHeaderBrand, ChatHeaderLeft, ChatMain, ChatMainContent, ChatMainForm, ChatMainFormSend, ChatMainFormUploadBtn, ChatSidebar, ChatSidebarContainer, ChatSidebarContent, LinkDiv, LogoutDiv, User, UserAvatar, UserDetail, UsersContainer } from "./Chat.styled";
import { ChatMessage } from "../../components";
import { AiOutlineSend } from 'react-icons/ai';
import { useContext, useState, useEffect, useRef } from "react";
import { WebSocketContext } from "../../contexts/websocket.context";
import Message, { DataTypes } from "../../../../shared/Message";
import { Logger, isCustomEvent, wait } from "../../utils";
import { useNavigate } from "react-router-dom";
import { FireBaseContext } from "../../contexts/firebase.context";
import { LoaderContext } from "../../contexts/loader.context";
import { CiLogout, CiCirclePlus } from 'react-icons/ci'
import AccountManager from "../../structures/AccountManager";
import { IoIosLink } from "react-icons/io";
import type { User as FirebaseUser } from "firebase/auth";
import { DbChannel, DbUser, channelsDb, messagesDb, usersDb } from "../../../../database";
import ChannelDialog from "./ChannelDialog/ChannelDialog";

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
    const [channels, setChannels] = useState<DbChannel[]>([]);
    const [users, setUsers] = useState<{ [userId: string]: DbUser }>({});
    const loaderContext = useContext(LoaderContext);
    const [channelDialog, setChannelDialog] = useState<[boolean, 'create'|'join']>([false, 'create'])

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



    function initChat() {


        if (!authContext.user) return navigate('/signup');


        usersDb.getUser(authContext.user).then(console.log)



        wsm.addEventListener('wsopen', handshake);
        wsm.addEventListener(Message.types[Message.types.SET_ACTIVE_CHANNEL], receivedSetActiveChannel);
        wsm.addEventListener(Message.types[Message.types.HANDSHAKE], receivedHandshake);
        // wsm.addEventListener(Message.types[Message.types.JOIN_CHANNEL], joinChannelEvent)

        // wsm.addEventListener(Message.types[Message.types.USER_JOIN], userJoinEvent);

        if (!wsm._open) {
            wsm.connect();

        }
    }

    const handshake = () => {
        user = authContext.user;
        console.log('ws open');
        const userId = (authContext.user as FirebaseUser).uid;

        wsm.send(new Message<DataTypes.Client.HANDSHAKE>({
            type: Message.types.HANDSHAKE,
            data: [{ userId: userId }]
        }))
    }

    const receivedHandshake = async (ev: any) => {
        if (!isCustomEvent(ev)) return;


        loaderContext.setLoaderText("Fetching Channels")

        let dbchannels = await usersDb.getChannelsInUser((authContext.user as FirebaseUser).uid);

        console.log("GETTING DB USER CHANNELS", dbchannels);


        setChannels(dbchannels);

        loaderContext.setLoader(false)
    }

    const joinChannelEvent = async (ev: any) => {
        if (!isCustomEvent(ev)) return;

        // loaderContext.setLoaderText("Fetching Messages...")

        // const msg: DataTypes.Server.JOIN_CHANNEL = ev.detail;
        // console.log('JOIN CHANNLE', msg)

        // setUsers(msg);

        // // const data: any[] = await (await fetch('http://localhost:3000/messages?channelId=12345')).json() //Db.getMessages('12345');
        // const data = await messagesDb.getMessages('12345')
        // console.log("getting data from db", data)
        // setMessage([...message, ...data])
        // // loaderContext.setLoader(false)

        // loaderContext.setLoaderText("Fetching Channels")

        // let dbchannels = await usersDb.getChannelsInUser((authContext.user as FirebaseUser).uid);

        // console.log("GETTING DB USER CHANNELS", dbchannels);

        // // dbchannels = await usersDb.getChannelsInUser()

        // setChannels(dbchannels);

        // // loaderContext.setLoaderText("Fetching channel members");

        // // console.log("channels from state check", channels)

        // const dbusers = await channelsDb.getUsersInChannel(dbchannels[0].channelId);

        // console.log("testing new db function", dbusers)

        // loaderContext.setLoader(false);
        // getUsers();
    }

    // const userJoinEvent = () => {
    //     setCurrentChannel('12345');

    //     wsm.send(new Message<DataTypes.Client.JOIN_CHANNEL>({
    //         type: Message.types.JOIN_CHANNEL,
    //         data: [{ channelId: currentChannel || '12345' }]
    //     }))
    // }


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

    // const userJoin = () => {
    //     user = authContext.user;

    //     console.log('ws open');

    //     wsm.send(new Message<DataTypes.Client.USER_JOIN>({
    //         type: Message.types.USER_JOIN,
    //         // @ts-ignore
    //         data: [{ username: user.displayName || 'unknown user', userId: user.uid, avatar: Math.floor(Math.random() * 50) }]
    //     }))
    // }

    const signOut = () => {
        AccountManager.signOut();
        wsm.disconnect();
        setUsers({});
        setMessage([]);

        wsm.removeEventListener('wsopen', handshake);
        // wsm.removeEventListener(Message.types[Message.types.JOIN_CHANNEL], joinChannelEvent);
        // wsm.removeEventListener(Message.types[Message.types.USER_JOIN], userJoinEvent);

    }

    const switchChannels = async (channelId: string) => {
        loaderContext.setLoader(true);
        await wait(1400);
        loaderContext.setLoaderText("Switching channels")


        setCurrentChannel(channelId);

        loaderContext.setLoaderText("Fetching Channels")

        let dbchannels = await usersDb.getChannelsInUser((authContext.user as FirebaseUser).uid);

        setChannels(dbchannels);

        loaderContext.setLoaderText("Fetching Messages...")

        console.log("GETTING MESSAGES FOR CHANNEL ", channelId);


        const dbmessages = await messagesDb.getMessages(channelId, 10);

        setMessage(dbmessages);

        loaderContext.setLoaderText("Fetching channel members...");

        const dbusers = await channelsDb.getUsersInChannel(channelId);

        const dbuserstate: any = {}
        for (let i = 0; i < dbusers.length; i++) {
            let idbuser = dbusers[i];
            let idbuserId = idbuser.userId;
            dbuserstate[idbuserId as string] = idbuser;
        }
        setUsers(dbuserstate);


        await wait(2000);
        loaderContext.setLoader(false);

        console.log(">>?!?!?! set active channel", currentChannel)
    }


    const receivedSetActiveChannel = async (ev: any) => {
        if (!isCustomEvent(ev)) return;
        const data: DataTypes.Server.SET_ACTIVE_CHANNEL = ev.detail;
        console.log(">!>!>!>!>!> RECEIVED ACTIVE CHANNEL", ev.detail)
        switchChannels(data[0].channelId);

    }


    const onChannelClick = (channelId: string) => {
        console.log("A CHANNEL GOT CLICKED", channelId)

        wsm.send(new Message<DataTypes.Client.SET_ACTIVE_CHANNEL>({
            type: Message.types.SET_ACTIVE_CHANNEL,
            data: [{ channelId }]
        }))
    }



    return (
        <>
            {/* <Loader active={loaderActive} /> */}
            {/* {user ? */}
            <ChannelDialog channelDialog={channelDialog} setChannelDialog={setChannelDialog} switchChannels={onChannelClick} />

            <ChatDiv>
                <ChatContainer>
                    <ChatHeader>
                        <ChatHeaderBrand>Blitz App</ChatHeaderBrand>
                        <ChatHeaderLeft>
                            <LinkDiv>
                                <IoIosLink />
                            </LinkDiv>
                            <LogoutDiv onClick={() => signOut()}>
                                <CiLogout />
                            </LogoutDiv>

                        </ChatHeaderLeft>
                    </ChatHeader>

                    <ChatContent>
                        <ChatSidebar width={18}>

                            <ChannelsContainer>
                                {channels.map((channel, index) => (
                                    <ChannelDiv active={channel.channelId === currentChannel} onClick={() => onChannelClick(channel.channelId)} key={index}>
                                        {channel.name}
                                    </ChannelDiv>
                                ))}
                                <ChannelDiv onClick={() => setChannelDialog([true, 'create'])}>
                                    <CiCirclePlus style={{ fontSize: '1.5rem' }} />
                                    <div style={{ paddingLeft: "0.5rem" }}>Create Channel</div>
                                </ChannelDiv>
                                <ChannelDiv onClick={() => setChannelDialog([true, 'join'])}>
                                    <CiCirclePlus style={{ fontSize: '1.5rem' }} />
                                    <div style={{ paddingLeft: "0.5rem" }}>Join Channel</div>
                                </ChannelDiv>
                            </ChannelsContainer>
                        </ChatSidebar>
                        <ChatMain>
                            <ChatMainContent ref={chatMainRef}>
                                {!currentChannel ?
                                    <ChatMessage
                                        avatar={0}
                                        author="bot"
                                        content="click a chat to get started"
                                        timestamp={new Date(Date.now()).toLocaleDateString()}
                                    />

                                    : message.map((item, i) => (
                                        <ChatMessage
                                            avatar={0}
                                            author={users[item.author]?.username}
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
                                Object.values(users).map(user => {
                                    return (
                                        <User><UserAvatar src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${0}`}></UserAvatar><UserDetail>{user.username}</UserDetail></User>
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