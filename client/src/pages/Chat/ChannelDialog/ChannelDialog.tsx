import React, { useContext, useEffect } from 'react';
import { ChannelDialog as IChannelDialog, ChannelDialogContent, ChannelDialogContainer, ChannelDialogHeading, Form, InputContainer, InputHeading, Input, SubmitButton, CloseBtn, ChannelDialogHeadingContent } from './ChannelDialog.styled';
import { IoCloseOutline } from 'react-icons/io5'
import Message, { DataTypes } from '../../../../../shared/Message';
import { FireBaseContext } from '../../../contexts/firebase.context';
import { WebSocketContext } from '../../../contexts/websocket.context';
import { LoaderContext } from '../../../contexts/loader.context';
import { isCustomEvent, wait } from '../../../utils';
import { usersDb } from '../../../../../database';
import { User } from 'firebase/auth';


function ChannelDialog({ channelDialog, setChannelDialog, switchChannels }: { switchChannels: (channelId: string) => any, channelDialog: [boolean, 'create'|'join'], setChannelDialog: (React.Dispatch<React.SetStateAction<[boolean, 'create'|'join']>>) }) {

    const authContext = useContext(FireBaseContext);
    const wsContext = useContext(WebSocketContext);
    const loaderContext = useContext(LoaderContext);

    useEffect(() => {
        wsContext.addEventListener(Message.types[Message.types.CREATE_CHANNEL], async ev => {
            ev.preventDefault();
            if (!isCustomEvent(ev)) return;

            loaderContext.setLoaderText("Creating new channel...");

            const data: DataTypes.Server.CREATE_CHANNEL[0] = ev.detail[0];


            await usersDb.setUserChannel(authContext.user as User, data.channelId, 'add')


            
            switchChannels(data.channelId)


            setChannelDialog([false, channelDialog[1]]);




        })
    }, [])

    async function onSubmit(ev: any) {
        loaderContext.setLoader(true)
        loaderContext.setLoaderText("Creating new channel...")
        ev.preventDefault();
        let channelName = ev.target.channelname.value;

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


    return (
        <ChannelDialogContainer
            show={channelDialog[0]}
        >
            <IChannelDialog
                show={channelDialog[0]}
            >
                <ChannelDialogHeading>
                    <ChannelDialogHeadingContent>{channelDialog[1] == 'create' ? "Channel Name" : "Join Channel"}</ChannelDialogHeadingContent>
                    <CloseBtn onClick={() => setChannelDialog([false, channelDialog[1]])}>close</CloseBtn>
                </ChannelDialogHeading>
                <Form onSubmit={onSubmit}>
                    <InputContainer>
                        <InputHeading>{channelDialog[1] == 'create' ? "Channel Name" : "Invite Link/Code"}</InputHeading>
                        <Input
                            type="text"
                            name="channelname"
                            id="channelname"
                            placeholder="Channel name"
                            autoComplete='off'
                            required
                        />
                    </InputContainer>
                    <InputContainer justify='flex-end'>
                        <SubmitButton type='submit'>{channelDialog[1] === 'create' ? 'Create' : 'Join'}</SubmitButton>
                    </InputContainer>
                </Form>

            </IChannelDialog>
        </ChannelDialogContainer>
    )
}

export default ChannelDialog;