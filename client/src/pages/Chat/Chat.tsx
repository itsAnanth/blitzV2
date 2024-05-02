import { ChannelDiv, ChannelsContainer, ChatContainer, ChatContent, ChatDiv, ChatHeader, ChatHeaderBrand, ChatHeaderLeft, ChatMain, ChatMainContent, ChatMainForm, ChatMainFormSend, ChatMainFormUploadBtn, ChatSidebar, ChatSidebarContainer, ChatSidebarContent, LinkDiv, LogoutDiv, MediaPreviewAudio, MediaPreviewData, MediaPreviewDetail, MediaPreviewImage, MediaPreviewVideo, NoChat, NoChatContent, NoChatIcon, User, UserAvatar, UserDetail, UsersContainer } from "./Chat.styled";
import { ChatMessage } from "../../components";
import { AiOutlineSend } from 'react-icons/ai';
import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { WebSocketContext } from "../../contexts/websocket.context";
import Message, { DataTypes } from "../../../../shared/Message";
import { Logger, fileType, isCustomEvent, wait } from "../../utils";
import { useNavigate } from "react-router-dom";
import { FireBaseContext } from "../../contexts/firebase.context";
import { LoaderContext } from "../../contexts/loader.context";
import { CiLogout, CiCirclePlus } from 'react-icons/ci'
import AccountManager from "../../structures/AccountManager";
import { IoIosLink } from "react-icons/io";
import type { User as FirebaseUser } from "firebase/auth";
import { DbChannel, DbMessage, DbUser, channelsDb, messagesDb, usersDb } from "../../../../database";
import ChannelDialog from "./ChannelDialog/ChannelDialog";
import { MdMessage } from "react-icons/md";
import Profile from "../Profile/Profile";
import CopyLink from "./CopyLink/CopyLink";
import { Tooltip, Dialog, Button, Box, DialogContentText, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ThemeContext } from "styled-components";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function Chat() {
    const useLoader = true;
    const authContext = useContext(FireBaseContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const themeContext = useContext(ThemeContext);
    const [file, setFile] = useState<File | null>(null);
    const formContainerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLInputElement>(null);
    const chatMainRef = useRef<HTMLDivElement>(null);
    const [mediaURL, setMediaURL] = useState<string | null>(null);
    const [fileReader, setFileReader] = useState<any>(null);
    const [uploadingMedia, setUploadingMedia] = useState(false);

    type messageType = DataTypes.Server.MESSAGE_CREATE[0];
    type LoadingStatus = {
        messages: boolean,
        channels: boolean,
        users: boolean
    }

    const wsm = useContext(WebSocketContext);
    const loaderContext = useContext(LoaderContext);

    const [message, setMessage] = useState<DbMessage[]>([]);
    const [channels, setChannels] = useState<DbChannel[]>([]);
    const [users, setUsers] = useState<{ [userId: string]: DbUser }>({
        // "bot": {
        //     username: 'bot',
        //     userId: '0',
        //     photoURL: '',

        // }
    });
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({ channels: true, users: true, messages: true });
    const [currentChannel, setCurrentChannel] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [listeners, setListeners] = useState([]);



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
        Logger.logc('RED', 'SCROLLING TO', chatMainRef.current?.scrollHeight)
        chatMainRef.current?.scrollTo({ 'top': chatMainRef.current.scrollHeight });
    }, [message]);

    useEffect(() => {

        const messageCreate = (ev: any) => {
            if (!isCustomEvent(ev)) return;


            const data: DataTypes.Server.MESSAGE_CREATE = ev.detail;


            setMessage([...message, data[0]]);


        }
        wsm.addEventListener(Message.types[Message.types.MESSAGE_CREATE], messageCreate);
        Logger.logc('lightgreen', 'ADD_EVENT_LISTENERS', "adding message listener");


        return () => {
            Logger.logc('lightgreen', 'REMOVE_EVENT_LISTENERS', "removing message listener");
            wsm.removeEventListener(Message.types[Message.types.MESSAGE_CREATE], messageCreate)
        };
    }, [message, setMessage]);

    useEffect(() => {

        const receivedUserJoin = async (ev: any) => {
            if (!isCustomEvent(ev)) return;
            const data: DataTypes.Server.USER_JOIN = ev.detail;



            setUsers({ ...users, [data[0].userId]: data[0] })

        }

        wsm.addEventListener(Message.types[Message.types.USER_JOIN], receivedUserJoin);

        return () => {
            Logger.logc('lightgreen', 'REMOVE_EVENT_LISTENERS', "removing user join listener");

            wsm.removeEventListener(Message.types[Message.types.USER_JOIN], receivedUserJoin)
        };


    }, [users, setUsers])

    useEffect(() => {
        if (!isLoaded && useLoader) {
            loaderContext.setLoader(true)
            Logger.logc('lightgreen', 'DEPENDENCIES DATA', 'RESOLVING', isLoaded)

        } else {
            loaderContext.setLoader(false);
            Logger.logc('lightgreen', 'DEPENDENCIES DATA', 'RESOLVED', isLoaded)
            chatMainRef.current?.scrollTo({ 'top': chatMainRef.current.scrollHeight });

        }
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
        // user = authContext.user;
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






    const sendMessage = async (content: string) => {


        Logger.logc('lightgreen', 'SENDING_MESSAGE', 'sending message to', currentChannel);


        if (!authContext.user) return Logger.error('user undefined on send message');

        if (!currentChannel) return console.error('Invalid current channel');

        const messageData: any = {
            content: content ?? "",
            recipient: currentChannel,
            author: authContext.user?.uid

        }

        if (file !== null) {
            messageData.attachment = {
                type: file.type,
                url: mediaURL
            }
        } else {
            messageData.attachment = null;
        }


        wsm.send(
            new Message<DataTypes.Client.MESSAGE_CREATE>({
                type: Message.types.MESSAGE_CREATE,
                data: [messageData]
            }).encode()
        )


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


        Logger.logc('lightgreen', 'REMOVE_EVENT_LISTENERS', 'removing activeChannel and handshake listeners');

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
        useLoader && await wait(2000);
        setCurrentChannel(channelId);
    }


    const getChannels = async () => {
        Logger.logc('purple', "DB_USERS", "getting channels in user", authContext.user?.uid);

        let dbchannels = await usersDb.getChannelsInUser((authContext.user as FirebaseUser).uid);



        setChannels(dbchannels);

        return dbchannels;

    }

    const getUsers = async (channelId: string) => {

        loaderContext.setLoaderText('Fetching users...')

        const dbusers = await channelsDb.getUsersInChannel(channelId);



        const dbuserstate: any = {}
        for (let i = 0; i < dbusers.length; i++) {
            let idbuser = dbusers[i];
            let idbuserId = idbuser.userId;
            dbuserstate[idbuserId as string] = idbuser;
        }

        Logger.logc('purple', "DB_CHANNELS", "getting users in channel", channelId, dbuserstate);

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

        Promise.all(promises).then(() => {
            setIsLoaded(true)
        });



    }, [currentChannel])

    useEffect(() => {
        Logger.logc('red', 'DEBUG', 'channel changed', channels)
    }, [channels])


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

    const onFileChange = (ev: any) => {
        setFile(ev.target.files[0])
        console.log("change file", (file != null && uploadingMedia))
    }

    const handleClose = () => {
        setOpen(false);
        setFile(null)
        setUploadingMedia(false);
        setFileReader(null);
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleFileReader = async (file: Blob) => {
        const reader = new FileReader();

        const src = reader.readAsDataURL(file);

        reader.onload = function (e) {
            setFileReader(e.target?.result)
        }
    }

    const handleMedia = async (ev: any) => {
        ev.preventDefault()
        setUploadingMedia(true);

        const formData = new FormData();
        // @ts-ignore
        formData.append('file', file)

        if (!file) return console.error("no file")


        if (!currentChannel) return console.error('no channel')


        console.log(file, uploadingMedia, file == null && !uploadingMedia)

        const url = await messagesDb.uploadMedia(file, currentChannel);

        setMediaURL(url);




        // console.log("uploaded!!!", photoURL)
    }

    useEffect(() => {
        if (file != null)
            handleFileReader(file);
    }, [file])

    useEffect(() => {

        if (mediaURL != null) {
            sendMessage('');
            handleClose();

        }

    }, [mediaURL])

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    const getPreview = () => {
        let preview = <MediaPreviewImage />;

        if (!file) {
            console.error('preview loading failed');
            return preview;
        }

        if (fileType(file.type) === 'image')
            preview = <MediaPreviewImage src={fileReader} />
        else if (fileType(file.type) === 'audio')
            preview = <MediaPreviewAudio controls={true} src={fileReader} />
        else if (fileType(file.type) === 'video')
            preview = <MediaPreviewVideo controls={true} width="320" height="240" src={fileReader} />

        return preview;

    }





    return (
        <>
            {/* <ChannelDialog channelDialog={channelDialog} setChannelDialog={setChannelDialog} switchChannels={onChannelClick} /> */}

            <React.Fragment>

                <Dialog
                    maxWidth={'md'}
                    open={open}

                    fullWidth={true}

                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: handleMedia,
                        style: {
                            backgroundColor: themeContext.tertiary,
                            color: themeContext.text
                        }
                    }}
                >
                    <DialogTitle style={{
                        color: themeContext.text
                    }}>Upload Media</DialogTitle>
                    <DialogContent >
                        <DialogContentText style={{
                            color: themeContext.lightText,
                            marginBottom: '1.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>{(file != null && fileReader != null) ? "Selected Media File Preview" : "Select Your Media file"}</DialogContentText>
                        {file != null && fileReader != null &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                {!uploadingMedia ? <>
                                        {getPreview()}
                                        <MediaPreviewDetail>
                                            <MediaPreviewData>{`File Name: ${file.name}`}</MediaPreviewData>
                                            <MediaPreviewData>{`File Type: ${file.type}`}</MediaPreviewData>
                                            <MediaPreviewData>{`File size: ${formatBytes(file.size)}`}</MediaPreviewData>

                                        </MediaPreviewDetail>
                                    </> : <>
                                        <MediaPreviewData>Uploading file...</MediaPreviewData>
                                    </>}
                            </Box>
                        }

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}>

                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                sx={{
                                    marginTop: '1rem'
                                }}
                            >
                                Select File
                                <VisuallyHiddenInput type="file" onChange={onFileChange} />
                            </Button>
                        </Box>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button

                            disabled={(file != null && uploadingMedia)}
                            type="submit">Upload File</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

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
                                    <Tooltip key={index} title={'Click to switch channels'} placement="right">
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
                                        {isLoaded && message.map((item, i) => {
                                            // Logger.logc('cyan', 'iterator', item.messageId, item.author)
                                            return <ChatMessage
                                                msg={item}
                                                user={users[item.author]}
                                                key={i}
                                            />
                                        }
                                        )}
                                    </ChatMainContent>
                                    <ChatMainForm ref={formContainerRef}>

                                        <form onSubmit={(ev) => {
                                            ev.preventDefault();

                                            // @ts-ignore
                                            sendMessage(ev.target.message.value)
                                            // @ts-ignore

                                            ev.target.message.value = '';
                                        }}>
                                            <ChatMainFormUploadBtn onClick={handleOpen}>
                                                <CiCirclePlus />
                                            </ChatMainFormUploadBtn>

                                            <input
                                                ref={textRef}
                                                placeholder="Message"
                                                name="message"
                                                autoComplete="off"
                                            />
                                            <ChatMainFormSend disabled={file != null} type="submit"><AiOutlineSend /></ChatMainFormSend>
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
                                        <Tooltip key={index} title={'View User Profile'} placement="left">
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