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

export default function CopyLink({ channelId }: { channelId: string }) {
    const [open, setOpen] = useState(false);
    const themeContext = useContext(ThemeContext);

    const openAlert = () => {
        navigator.clipboard.writeText(channelId);
        setOpen(true);

        setTimeout(() => {
            setOpen(false)
        }, 3500);
    }

    return (

        <>
            <LinkDiv onClick={() => openAlert()}>
                <IoIosLink />
            </LinkDiv>
            <Box sx={{ position: 'fixed', width: '50%', top: '20px', left: '50%', transform: 'translate(-50%, 0)' }}>
                <Collapse in={open}>
                    <Alert
                        severity="success"
                        style={{
                            backgroundColor: themeContext.tertiary,
                            color: themeContext.text
                        }}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        Channel Code has been copied to your clipboard, share it with a friend to start chatting!
                    </Alert>
                </Collapse>
            </Box>
        </>
    );
}
