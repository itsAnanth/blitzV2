import { ChannelDiv, ChannelsContainer, ChatContainer, ChatContent, ChatDiv, ChatHeader, ChatHeaderBrand, ChatHeaderLeft, ChatMain, ChatMainContent, ChatMainForm, ChatMainFormSend, ChatMainFormUploadBtn, ChatSidebar, ChatSidebarContainer, ChatSidebarContent, LinkDiv, LogoutDiv, NoChat, NoChatContent, NoChatIcon, User, UserAvatar, UserDetail, UsersContainer } from "./Chat.styled";
import { ChatMessage } from "../../components";
import { AiOutlineSend } from 'react-icons/ai';
import { useContext, useState, useEffect, useRef, useCallback } from "react";
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
import Profile from "../Profile/Profile";
import CopyLink from "./CopyLink/CopyLink";
import { Tooltip } from "@mui/material";

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
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({ channels: true, users: true, messages: true });
    const [currentChannel, setCurrentChannel] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);



    useEffect(() => {

        // @ts-ignore
        window.ws = wsm;

        console.log("FIRST ITME EFFECT CALLED")
        initChat();


        setIsLoaded(false);

        // if (wsm._open)
        //     getChannels()
        if (wsm.hasFinishedInitialLoad) {
            // getChannels()
            // setCurrentChannel(null)
            navigate(0)
        }


    }, []);

    useEffect(() => {
        if (authContext.user === null) navigate('/')
    }, [authContext.user])

    // useEffect(() => {
    //     console.log(users)
    // }, [users])

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

        const receivedUserJoin = async (ev: any) => {
            if (!isCustomEvent(ev)) return;
            const data: DataTypes.Server.USER_JOIN = ev.detail;



            setUsers({ ...users, [data[0].userId]: data[0] })

        }

        wsm.addEventListener(Message.types[Message.types.USER_JOIN], receivedUserJoin);

        return () => { wsm.removeEventListener(Message.types[Message.types.USER_JOIN], receivedUserJoin) };


    }, [users, setUsers])

    useEffect(() => {
        if (!isLoaded)
            loaderContext.setLoader(true)
        else
            loaderContext.setLoader(false);
    }, [isLoaded])


    function initChat() {


        if (!authContext.user) return navigate('/signup');


        // usersDb.getUser(authContext.user).then(console.log)






        if (!wsm._open) {
            Logger.logc('lightgreen', 'CONNECTING_WS', 'initiating connection');

            wsm.connect();
            Logger.logc('lightgreen', 'ADD_EVENT_LISTENERS', 'adding listeners');

            wsm.addEventListener('wsopen', handshake);
            wsm.addEventListener(Message.types[Message.types.SET_ACTIVE_CHANNEL], receivedSetActiveChannel);
            wsm.addEventListener(Message.types[Message.types.HANDSHAKE], receivedHandshake);

        }
    }

    const handshake = useCallback(() => {
        // @ts-ignore
        // console.log('LOGGING EVENT LISTENER FOR WSOPNE', getEventListeners(wsm, 'wsopen'))
        user = authContext.user;
        console.log('ws open');
        const userId = (authContext.user as FirebaseUser).uid;

        wsm.send(new Message<DataTypes.Client.HANDSHAKE>({
            type: Message.types.HANDSHAKE,
            data: [{ userId: userId }]
        }))
    }, [])

    const receivedHandshake = useCallback(async (ev: any) => {
        if (!isCustomEvent(ev)) return;



        loaderContext.setLoaderText("Fetching Channels")

        Promise.all([getChannels()]).then(() => {
            setIsLoaded(true);
            wsm.hasFinishedInitialLoad = true;
        })


    }, []);






    const sendMessage = (ev: React.FormEvent<HTMLFormElement>) => {

        ev.preventDefault();

        Logger.logc('lightgreen', 'SENDING_MESSAGE', 'sending message to', currentChannel);


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


    const signOut = async () => {
        Logger.logc('lightgreen', 'SIGNING_OUT', 'signing out user');
        loaderContext.setLoader(true)
        loaderContext.setLoaderText('Logging out...')
        await wait(1500)

        wsm.disconnect();
        setUsers({});
        setMessage([]);
        setCurrentChannel(null)
        setChannels([]);


        Logger.log('lightgreen', 'REMOVE_EVENT_LISTENERS', 'flushing listeners');

        wsm.removeEventListener('wsopen', handshake);
        wsm.removeEventListener(Message.types[Message.types.SET_ACTIVE_CHANNEL], receivedSetActiveChannel);
        wsm.removeEventListener(Message.types[Message.types.HANDSHAKE], receivedHandshake);

        wsm.disconnect();
        await AccountManager.signOut();

    }

    const switchChannels = async (channelId: string) => {
        Logger.logc('lightgreen', 'SWITCHING_CHANNELS', 'confirmed ws message, switching to', channelId);
        setIsLoaded(false)
        loaderContext.setLoaderText("Switching channels")
        await wait(2000);
        setCurrentChannel(channelId);
    }


    const getChannels = async () => {
        Logger.logc('purple', "DB_USERS", "getting channels in user", authContext.user?.uid);

        let dbchannels = await usersDb.getChannelsInUser((authContext.user as FirebaseUser).uid);



        setChannels(dbchannels);

        return dbchannels;

    }

    const getUsers = async (channelId: string) => {
        Logger.logc('purple', "DB_CHANNELS", "getting users in channel", channelId);

        loaderContext.setLoaderText('Fetching users...')

        const dbusers = await channelsDb.getUsersInChannel(channelId);

        const dbuserstate: any = {}
        for (let i = 0; i < dbusers.length; i++) {
            let idbuser = dbusers[i];
            let idbuserId = idbuser.userId;
            dbuserstate[idbuserId as string] = idbuser;
        }
        setUsers(dbuserstate);
    }

    const getMessages = async (channelId: string) => {
        Logger.logc('purple', "DB_MESSAGES", "getting messages in channel", channelId);



        const dbmessages = await messagesDb.getMessages(channelId, 10);

        setMessage(dbmessages);
    }


    useEffect(() => {
        if (!currentChannel) return;

        let promises: Promise<any>[] = [];
        const channelId = currentChannel;

        promises.push(getChannels());
        promises.push(getUsers(channelId));
        promises.push(getMessages(channelId));

        Promise.all(promises).then(() => setIsLoaded(true));

    }, [currentChannel])


    const receivedSetActiveChannel = useCallback(async (ev: any) => {
        if (!isCustomEvent(ev)) return;
        const data: DataTypes.Server.SET_ACTIVE_CHANNEL = ev.detail;
        switchChannels(data[0].channelId);

    }, []);




    const onChannelClick = (channelId: string) => {
        Logger.logc('lightgreen', "CHANNEL_CLICKED", channelId)

        if (currentChannel === channelId) return;

        wsm.send(new Message<DataTypes.Client.SET_ACTIVE_CHANNEL>({
            type: Message.types.SET_ACTIVE_CHANNEL,
            data: [{ channelId }]
        }))
    }

    const redirectToProfile = async (userId?: string) => {
        loaderContext.setLoader(true);
        loaderContext.setLoaderText('Loading user data...')
        await wait(1500);

        navigate(userId ? `/profile?id=${userId}` : '/profile')
    }


    const copyChannelCodeToClipboard = () => {

    }



    return (
        <>
            {/* <ChannelDialog channelDialog={channelDialog} setChannelDialog={setChannelDialog} switchChannels={onChannelClick} /> */}

            <ChatDiv>
                <ChatContainer>
                    <ChatHeader>
                        <ChatHeaderBrand>Blitz App</ChatHeaderBrand>
                        <ChatHeaderLeft>
                            {currentChannel && <CopyLink channelId={currentChannel as string} />}

                            <LogoutDiv onClick={() => signOut()}>
                                <CiLogout />
                            </LogoutDiv>

                        </ChatHeaderLeft>
                    </ChatHeader>

                    <ChatContent>
                        <ChatSidebar width={18}>

                            <ChannelsContainer>
                                {channels.map((channel, index) => (
                                    <Tooltip title={'Click to switch channels'} placement="right">
                                        <ChannelDiv active={channel.channelId === currentChannel} onClick={() => onChannelClick(channel.channelId)} key={index}>
                                            {channel.name}
                                        </ChannelDiv>
                                    </Tooltip>
                                ))}
                                <ChannelDialog switchChannels={onChannelClick} />
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

                            <UsersContainer>{currentChannel ? <>{
                                Object.values(users).map((user, index) => {
                                    return (
                                        <Tooltip title={'View User Profile'} placement="left">
                                            <User key={index} onClick={() => redirectToProfile(user.userId)}>
                                                <UserAvatar
                                                    crossOrigin="anonymous"
                                                    referrerPolicy="no-referrer"
                                                    src={user?.photoURL ?? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${0}`} />
                                                <UserDetail>{user.username}</UserDetail>
                                            </User>
                                        </Tooltip>
                                    )
                                })
                            }</>
                                :
                                <>
                                    <Tooltip title={'View User Profile'} placement="left">
                                        <User onClick={() => redirectToProfile()}>
                                            <UserAvatar
                                                crossOrigin="anonymous"
                                                referrerPolicy="no-referrer"
                                                src={authContext.user?.photoURL ?? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${0}`} />
                                            <UserDetail>{authContext.user?.displayName}</UserDetail>
                                        </User>
                                    </Tooltip>
                                </>
                            }</UsersContainer>

                        </ChatSidebar>
                    </ChatContent>
                </ChatContainer>
            </ChatDiv>

        </>
    )
}

export default Chat;