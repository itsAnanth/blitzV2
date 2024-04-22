import { ChannelDiv, ChannelsContainer, ChatContainer, ChatContent, ChatDiv, ChatHeader, ChatHeaderBrand, ChatHeaderLeft, ChatMain, ChatMainContent, ChatMainForm, ChatMainFormSend, ChatMainFormUploadBtn, ChatSidebar, ChatSidebarContainer, ChatSidebarContent, LinkDiv, LogoutDiv, NoChat, NoChatContent, NoChatIcon, User, UserAvatar, UserDetail, UsersContainer } from "./Chat.styled";
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
import { MdMessage } from "react-icons/md";

function Chat() {
    const authContext = useContext(FireBaseContext);
    const navigate = useNavigate();
    let user = authContext.user;
    const formContainerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLInputElement>(null);
    const chatMainRef = useRef<HTMLDivElement>(null);

    type messageType = DataTypes.Server.MESSAGE_CREATE[0];
    type LoadingStatus = {
        messages: boolean,
        channels: boolean,
        users: boolean
    }

    const wsm = useContext(WebSocketContext);
    const loaderContext = useContext(LoaderContext);

    const [message, setMessage] = useState<messageType[]>([]);
    const [channels, setChannels] = useState<DbChannel[]>([]);
    const [users, setUsers] = useState<{ [userId: string]: DbUser }>({});
    const [channelDialog, setChannelDialog] = useState<[boolean, 'create' | 'join']>([false, 'create'])
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({ channels: true, users: true, messages: true });
    const [currentChannel, setCurrentChannel] = useState<string | null>(null);



    useEffect(() => {

        initChat();


        setLoadingStatus({
            messages: true,
            channels: false,
            users: true
        })



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

        return () => { console.log("removing message listener"); wsm.removeEventListener(Message.types[Message.types.MESSAGE_CREATE], messageCreate) };
    }, [message, setMessage]);

    useEffect(() => {
        if (Object.values(loadingStatus).every(v => v === true)) {
            loaderContext.setLoader(false);
            if (channelDialog)
                setChannelDialog([false, channelDialog[1]]);
        } else
            loaderContext.setLoader(true);
    }, [loadingStatus])

    useEffect(() => {
        const status = { ...loadingStatus }
        status.channels = true;
        setLoadingStatus(status)
    }, [channels])

    useEffect(() => {
        const status = { ...loadingStatus }
        status.messages = true;
        setLoadingStatus(status)
    }, [message])

    useEffect(() => {
        const status = { ...loadingStatus }
        status.users = true;
        setLoadingStatus(status)
    }, [users])


    function initChat() {


        if (!authContext.user) return navigate('/signup');


        // usersDb.getUser(authContext.user).then(console.log)



        wsm.addEventListener('wsopen', handshake);
        wsm.addEventListener(Message.types[Message.types.SET_ACTIVE_CHANNEL], receivedSetActiveChannel);
        wsm.addEventListener(Message.types[Message.types.HANDSHAKE], receivedHandshake);


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


    }



    const sendMessage = (ev: React.FormEvent<HTMLFormElement>) => {

        console.log("sending message")
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


    const signOut = () => {
        AccountManager.signOut();
        wsm.disconnect();
        setUsers({});
        setMessage([]);
        setCurrentChannel(null)
        setChannels([]);
        

        wsm.removeEventListener('wsopen', handshake);
        wsm.removeEventListener(Message.types[Message.types.SET_ACTIVE_CHANNEL], receivedSetActiveChannel);
        wsm.removeEventListener(Message.types[Message.types.HANDSHAKE], receivedHandshake);

    }

    const switchChannels = async (channelId: string) => {
        // loaderContext.setLoader(true);

        setLoadingStatus({
            channels: false,
            messages: false,
            users: false
        })
        await wait(2000);
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


        // await wait(2000);
        // loaderContext.setLoader(false);

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
                            {currentChannel ?

                                <>
                                    <ChatMainContent ref={chatMainRef}>
                                        {message.map((item, i) => (
                                            <ChatMessage
                                                avatar={users[item.author]?.photoURL ?? 0}
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
                                </>
                                :
                                <NoChat>
                                    <NoChatIcon>
                                        <MdMessage />

                                    </NoChatIcon>
                                    <NoChatContent>
                                        Create or Join a chat to get started!
                                    </NoChatContent>

                                </NoChat>
                            }
                        </ChatMain>
                        <ChatSidebar width={22}>

                            <UsersContainer>{
                                Object.values(users).map(user => {
                                    return (
                                        <User>
                                            <UserAvatar src={user?.photoURL ?? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${0}`} />
                                            <UserDetail>{user.username}</UserDetail>
                                            </User>
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