import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { LinkDiv } from '../Chat.styled';
import { IoIosLink } from "react-icons/io";
import { ThemeContext } from 'styled-components';
import { AlertContext } from '../../../contexts/alert.context';

export default function CopyLink({ channelId }: { channelId: string }) {
    const alertContext = useContext(AlertContext);

    const openAlert = () => {
        navigator.clipboard.writeText(channelId);
        alertContext.setAlertText('Channel code has been copied to clipboard. share with friends to invite them now!');
        alertContext.setAlert(true);


        setTimeout(() => {
            alertContext.setAlert(false)
        }, 3500);
    }

    return (

        <>
            <LinkDiv onClick={() => { 
                openAlert();
            }}>
                <IoIosLink />
            </LinkDiv>

        </>
    );
}
