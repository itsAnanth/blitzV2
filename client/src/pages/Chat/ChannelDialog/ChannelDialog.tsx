import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ChannelDialog as IChannelDialog, ChannelDialogContent, ChannelDialogContainer, ChannelDialogHeading, Form, InputContainer, InputHeading, Input, SubmitButton, CloseBtn, ChannelDialogHeadingContent } from './ChannelDialog.styled';
import { IoCloseOutline } from 'react-icons/io5'
import Message, { DataTypes } from '../../../../../shared/Message';
import { FireBaseContext } from '../../../contexts/firebase.context';
import { WebSocketContext } from '../../../contexts/websocket.context';
import { LoaderContext } from '../../../contexts/loader.context';
import { Logger, isCustomEvent, wait } from '../../../utils';
import { channelsDb, usersDb } from '../../../../../database';
import { User } from 'firebase/auth';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ChannelDiv } from '../Chat.styled';
import { ThemeContext } from 'styled-components';
import { CiCirclePlus } from 'react-icons/ci';


function ChannelDialog({ switchChannels }: { switchChannels: (channelId: string) => any }) {

    const authContext = useContext(FireBaseContext);
    const wsContext = useContext(WebSocketContext);
    const loaderContext = useContext(LoaderContext);

    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'join' | 'create'>('create');
    const themeContext = useContext(ThemeContext);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setError(false);
        setErrorText('')
        setOpen(false);
    };

    const receivedCreateChannel = useCallback(async (ev: any) => {
        ev.preventDefault();
        if (!isCustomEvent(ev)) return;

        loaderContext.setLoaderText("Creating new channel...");

        const data: DataTypes.Server.CREATE_CHANNEL[0] = ev.detail[0];

        if (!authContext.user) return Logger.logc('red', 'CREATE CHANNEL ERROR', 'authcontext user is null')

        await usersDb.setUserChannel(authContext.user as User, data.channelId, 'add')

        Logger.log('red', 'CREATE CHANNEL FUNCTION', authContext.user)



        switchChannels(data.channelId)


        // setChannelDialog([false, channelDialog[1]]);





    }, [])

    const receivedJoinChannel = useCallback(async (ev: any) => {
        ev.preventDefault();
        if (!isCustomEvent(ev)) return;

        loaderContext.setLoaderText("Joining new channel...");

        const data: DataTypes.Server.JOIN_CHANNEL[0] = ev.detail[0];


        if (!authContext.user) return Logger.logc('red', 'JOIN CHANNEL ERROR', 'authcontext user is null')

        await usersDb.setUserChannel(authContext.user as User, data.channelId, 'add')



        switchChannels(data.channelId)


        // setChannelDialog([false, channelDialog[1]]);




    }, [])

    const detachChannelEvents = useCallback(() => {
        Logger.logc('lightgreen', 'REMOVE_EVENT_LISTENERS', 'removing join and create channel listeners')
        wsContext.removeEventListener(Message.types[Message.types.CREATE_CHANNEL], receivedCreateChannel)


        wsContext.removeEventListener(Message.types[Message.types.JOIN_CHANNEL], receivedJoinChannel)
        wsContext.removeEventListener('wsclose', detachChannelEvents);
    }, [])

    useEffect(() => {
        if (!wsContext.attachedChannelEvents) {
            wsContext.addEventListener(Message.types[Message.types.CREATE_CHANNEL], receivedCreateChannel)

            wsContext.addEventListener('wsclose', detachChannelEvents);

            wsContext.addEventListener(Message.types[Message.types.JOIN_CHANNEL], receivedJoinChannel)

            wsContext.attachedChannelEvents = true;
        }
    }, [])

    async function onSubmit(ev: any) {
        const joinChannel = type === 'join';
        ev.preventDefault();

        if (joinChannel) {
            let channelCode = ev.target.join.value;
            console.log("FORM FIREEEEEEEED", channelCode)


            const channel = await channelsDb.getChannelById(channelCode);

            if (!channel) {
                setError(true);
                setErrorText("Invalid Channel Code/Link")
                return
            }
            wsContext.send(new Message({
                type: Message.types.JOIN_CHANNEL,
                data: [{ channelId: channelCode }]
            }))

        } else {
            let channelName = ev.target.create.value as string;

            if (channelName.length > 15) {
                setError(true);
                setErrorText("Channel Name too long");
                return;
            }

            const channelData: DataTypes.Client.CREATE_CHANNEL = [
                {
                    channelName: channelName,
                    owner: authContext.user?.uid as string
                }
            ]

            wsContext.send(new Message({
                type: Message.types.CREATE_CHANNEL,
                data: channelData
            }))
        }


        handleClose();

        loaderContext.setLoader(true)
        loaderContext.setLoaderText(joinChannel ? "Joining Channel" : "Creating new channel...")




    }

    const channelClick = (type: 'join' | 'create') => {
        setType(type);
        handleClickOpen();
    }


    return (

        <>
            <ChannelDiv onClick={() => channelClick('join')}>
                <CiCirclePlus style={{ position: 'absolute', left: '10px', fontSize: "1.5rem" }} />
                <div style={{ paddingLeft: "0.5rem" }}>Join Channel</div>
            </ChannelDiv>
            <ChannelDiv onClick={() => channelClick('create')}>
                <CiCirclePlus style={{ position: 'absolute', left: '10px', fontSize: "1.5rem" }} />

                <div style={{ paddingLeft: "0.5rem" }}>Create Channel</div>
            </ChannelDiv>

            <React.Fragment>

                <Dialog
                    open={open}

                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: onSubmit,
                        style: {
                            backgroundColor: themeContext.tertiary,
                            color: themeContext.text
                        }
                    }}
                >
                    <DialogTitle style={{
                        color: themeContext.text
                    }}>{type == 'join' ? 'Join Channel' : 'Create Channel'}</DialogTitle>
                    <DialogContent >
                        <DialogContentText style={{
                            color: themeContext.lightText,
                            marginBottom: '1.5rem'
                        }}>
                            {type == 'create' ? "Create your own channel and invite your friends to start chatting!"
                                : "Join your friend's Channel with a valid code and start chatting now!"}
                        </DialogContentText>
                        <TextField
                            error={error}
                            helperText={errorText}
                            autoFocus
                            required
                            margin="dense"
                            color="primary"
                            id="name"
                            name={type}
                            label={type == 'join' ? "Channel Code/Link" : "Channel Name"}
                            type="text"
                            fullWidth
                            variant="outlined"
                            sx={{

                                input: {
                                    color: themeContext.lightText
                                }
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button

                            onClick={handleClose}>Cancel</Button>
                        <Button type="submit">{type == 'join' ? 'Join Channel' : 'Create Channel'}</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </>

    )
}

export default ChannelDialog;