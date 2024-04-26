import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeContext } from 'styled-components';
import { CiCirclePlus } from 'react-icons/ci';
import { Box, Input } from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FaPen } from "react-icons/fa";

import { useContext } from 'react';
import { FieldContent, FieldEditBtn, FieldHeading, ProfileContentField, ProfileContentImage, ProfileContentImageContainer, ProfileContentImageOverlay } from '../Profile.styled';
import { DbUser, usersDb } from '../../../../../database';
import { FireBaseContext } from '../../../contexts/firebase.context';
import { AlertContext } from '../../../contexts/alert.context';
import AccountManager from '../../../structures/AccountManager';

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

export default function EditUsername({ user, setUser }: { user: DbUser, setUser: any }) {

    const [open, setOpen] = useState(false);
    const themeContext = useContext(ThemeContext);
    const authContext = useContext(FireBaseContext);
    const alertContext = useContext(AlertContext);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");



    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true)
    }


    const onSubmit = async (ev: any) => {
        ev.preventDefault()

        const username = ev.target.username.value;

        console.log("new user", username)


        const user = await usersDb.getUser(authContext.user?.uid as string);
        if (!user) return;
        user.username = username;
        const data = await usersDb.updateUser(user)
        const dat = await AccountManager.update(username);

        setUser(user);
        alertContext.setAlertText('Username has been updated!')
        alertContext.setAlert(true)
        handleClose();

        setTimeout(() => {
            alertContext.setAlert(false)
        }, 3500);
    }




    return (
        <>
            <ProfileContentField>

                <FieldHeading>Display Name</FieldHeading>
                <FieldContent>{user?.username}</FieldContent>
                {user.userId === authContext.user?.uid &&
                    <FieldEditBtn onClick={handleOpen}>
                        <FaPen />
                    </FieldEditBtn>
                }
            </ProfileContentField>
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
                    }}>Update Username</DialogTitle>
                    <DialogContent >
                        <DialogContentText style={{
                            color: themeContext.lightText,
                            marginBottom: '1.5rem'
                        }}>
                            Enter your new username
                        </DialogContentText>
                        <TextField
                            error={error}
                            helperText={errorText}
                            autoFocus
                            required
                            margin="dense"
                            color="primary"
                            id="name"
                            name={'username'}
                            label="New Username"
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
                        <Button type="submit">Update</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </>

    )
}