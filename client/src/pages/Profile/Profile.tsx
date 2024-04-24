import React, { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../contexts/firebase.context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BackspaceIcon, FieldContent, FieldHeading, NoUserFound, ProfileContainer, ProfileContent, ProfileContentField, ProfileContentFieldContainer, ProfileContentImage, ProfileContentImageContainer, ProfileContentImageOverlay, ProfileHeader } from "./Profile.styled";
import { LoaderContext } from "../../contexts/loader.context";
import { DbUser, usersDb } from "../../../../database";
import { IoArrowBack } from "react-icons/io5";
import { FaPen } from "react-icons/fa";

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


function Profile() {

    const authContext = useContext(FireBaseContext);
    const navigate = useNavigate();
    const loaderContext = useContext(LoaderContext);
    const [searchParams, setSearchParams] = useSearchParams()
    const [user, setUser] = useState<DbUser>();
    const idParam = searchParams.get('id');
    const [open, setOpen] = useState(false);
    const themeContext = useContext(ThemeContext);
    const [file, setFile] = useState<File | null>(null);



    useEffect(() => {
        console.log("after")
        if (!authContext.user)
            return navigate('/signup');

        const userId = idParam ? idParam : authContext.user.uid as string;

        (async () => {
            const userData = await usersDb.getUser(userId);

            // if (!userData) return navigate('/signup');
            setUser(userData as DbUser);
        })()
    }, [])

    useEffect(() => {
        console.log("user changed", user)
        if (user == null) {
            console.log("profile useeff hook", user)
            // return navigate('/signup')
        }
        if (loaderContext)
            loaderContext.setLoader(false);
    }, [user])

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

        // const photoURL = await usersDb.uploadProfilePicture(file, authContext.user?.uid as string)
        // const user = await usersDb.getUser(authContext.user?.uid as string) as DbUser;

        // if (!user) console.error('no user');

        // user.photoURL = photoURL;
        // await usersDb.updateUser(user);

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

            <ProfileContainer>
                <ProfileHeader>
                    <BackspaceIcon onClick={() => navigate('/chat')}>
                        <IoArrowBack />
                    </BackspaceIcon>
                    {idParam ? 'User Profile' : 'My Profile'}
                </ProfileHeader>
                {
                    user ?
                        <ProfileContent>
                            <ProfileContentImageContainer>
                                <ProfileContentImage

                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                    src={user?.photoURL}
                                />
                                <ProfileContentImageOverlay onClick={() => handleOpen()}>
                                    <FaPen />
                                </ProfileContentImageOverlay>
                            </ProfileContentImageContainer>

                            <ProfileContentFieldContainer>
                                <ProfileContentField>
                                    <FieldHeading>Display Name</FieldHeading>
                                    <FieldContent>{user?.username}</FieldContent>
                                </ProfileContentField>

                                <ProfileContentField>
                                    <FieldHeading>User ID</FieldHeading>
                                    <FieldContent>{user?.userId}</FieldContent>
                                </ProfileContentField>

                                <ProfileContentField>
                                    <FieldHeading>Email Address</FieldHeading>
                                    <FieldContent>{authContext.user?.email}</FieldContent>
                                </ProfileContentField>

                                <ProfileContentField>
                                    <FieldHeading>Account Creation Date</FieldHeading>
                                    {/** @ts-ignore */}
                                    <FieldContent>{new Date(user?.timestamp).toDateString()}</FieldContent>
                                </ProfileContentField>


                            </ProfileContentFieldContainer>
                        </ProfileContent>
                        :
                        <NoUserFound>
                            {`No such user found (user ID: ${idParam})`}
                        </NoUserFound>
                }
            </ProfileContainer>
        </>
    )
}

export default Profile;