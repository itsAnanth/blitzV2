import React, { useContext, useEffect } from 'react';
import { ChannelDialog, ChannelDialogContent, ChannelDialogContainer, ChannelDialogHeading, Form, InputContainer, InputHeading, Input, SubmitButton, CloseBtn } from './ChannelCreate.styled';
import { IoCloseOutline } from 'react-icons/io5'
import Message, { DataTypes } from '../../../../../shared/Message';
import { FireBaseContext } from '../../../contexts/firebase.context';
import { WebSocketContext } from '../../../contexts/websocket.context';
import { LoaderContext } from '../../../contexts/loader.context';
import { isCustomEvent } from '../../../utils';
import Db from '../../../structures/Db';
import { User } from 'firebase/auth';


function ChannelCreate({ channelDialog, setChannelDialog }: { channelDialog: boolean, setChannelDialog: (React.Dispatch<React.SetStateAction<boolean>>) }) {

    const authContext = useContext(FireBaseContext);
    const wsContext = useContext(WebSocketContext);
    const loaderContext = useContext(LoaderContext);

    useEffect(() => {
        wsContext.addEventListener(Message.types[Message.types.CREATE_CHANNEL], async ev => {
            ev.preventDefault();
            if (!isCustomEvent(ev)) return;

            loaderContext.setLoaderText("Authenticating...");
            
            const data: DataTypes.Server.CREATE_CHANNEL[0] = ev.detail[0];


            await Db.setUserChannel(authContext.user as User, data.channelId, 'add')


            


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
            show={channelDialog}
        >
            <ChannelDialog
                show={channelDialog}
            >
                <ChannelDialogHeading>
                    CreateChannel
                    <CloseBtn onClick={() => setChannelDialog(false)}>close</CloseBtn>
                </ChannelDialogHeading>
                <Form onSubmit={onSubmit}>
                    <InputContainer>
                        <InputHeading>Channel Name</InputHeading>
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
                        <SubmitButton type='submit'>Create</SubmitButton>
                    </InputContainer>
                </Form>

            </ChannelDialog>
        </ChannelDialogContainer>
    )
}

export default ChannelCreate;