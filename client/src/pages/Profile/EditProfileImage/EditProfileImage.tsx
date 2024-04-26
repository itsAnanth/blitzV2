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
import { ProfileContentImage, ProfileContentImageContainer, ProfileContentImageOverlay } from '../Profile.styled';
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

export default function EditProfileImage({ user, setUser }: { user: DbUser, setUser: any }) {

    const [open, setOpen] = useState(false);
    const themeContext = useContext(ThemeContext);
    const [file, setFile] = useState<File | null>(null);
    const authContext = useContext(FireBaseContext);
    const alertContext = useContext(AlertContext);



    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true)
    }


    const onSubmit = async (ev: any) => {
        ev.preventDefault()

        const formData = new FormData();
        // @ts-ignore
        formData.append('file', file)

        if (!file) return console.error("no file")


        console.log(file)

        const photoURL = await usersDb.uploadProfilePicture(file, authContext.user?.uid as string)
        const user = await usersDb.getUser(authContext.user?.uid as string) as DbUser;

        if (!user) console.error('no user');

        user.photoURL = photoURL;
        await usersDb.updateUser(user);
        await AccountManager.updateProfilePicture(photoURL)
  

        setUser(user);
        handleClose();

        alertContext.setAlertText("Updated profile");
        alertContext.setAlert(true);

        setTimeout(() => alertContext.setAlert(false), 3500);


        // console.log("uploaded!!!", photoURL)
    }

    const onFileChange = (ev: any) => {
        setFile(ev.target.files[0])
    }



    return (
        <>
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
                    }}>Upload Profile Picture</DialogTitle>
                    <DialogContent >
                        <DialogContentText style={{
                            color: themeContext.lightText,
                            marginBottom: '1.5rem'
                        }}>Your new Profile Picture</DialogContentText>
                        <Box width={'100%'} display={'flex'} justifyContent={'center'}>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload file
                                <VisuallyHiddenInput type="file" onChange={onFileChange} />
                            </Button>
                        </Box>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            disabled={file != null ? false : true}
                            type="submit">Upload</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <ProfileContentImageContainer>
                <ProfileContentImage

                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    src={user?.photoURL}
                />
                {user.userId === authContext.user?.uid &&
                    <ProfileContentImageOverlay onClick={() => handleOpen()}>
                        <FaPen />
                    </ProfileContentImageOverlay>
                }
            </ProfileContentImageContainer>
        </>

    )
}