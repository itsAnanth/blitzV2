import React, { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../contexts/firebase.context";
import { redirect, Link, useNavigate, useSearchParams } from "react-router-dom";
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
import EditProfileImage from "./EditProfileImage/EditProfileImage";
import DeleteAccount from "./DeleteAccount/DeleteAccount";
import EditUsername from "./EditUsername/EditUsername";




function Profile() {

    const authContext = useContext(FireBaseContext);
    const navigate = useNavigate();
    const loaderContext = useContext(LoaderContext);
    const [searchParams, setSearchParams] = useSearchParams()
    const [user, setUser] = useState<DbUser | null | undefined>(undefined);
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
        console.log('change', user)
        if (authContext.user === null) {
            return navigate('/')
        }

        if (loaderContext.loader)
            loaderContext.setLoader(false)
    }, [authContext.user])


    const redirectToChat = async () => {
        if (true)
            return navigate('/chat')
    }





    return (

        <>

            <ProfileContainer>
                <ProfileHeader>
                    <BackspaceIcon onClick={() => redirectToChat()}>
                        <IoArrowBack />
                    </BackspaceIcon>
                    {idParam ? 'User Profile' : 'My Profile'}
                </ProfileHeader>
                {
                    user ?
                        <ProfileContent>
                            <EditProfileImage user={user} setUser={setUser} />

                            <ProfileContentFieldContainer>
                                <EditUsername user={user} setUser={setUser} />

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
                                {user.userId === authContext.user?.uid &&
                                    <ProfileContentField id="lol">
                                        <FieldHeading>Account Deletion</FieldHeading>
                                        <FieldContent><DeleteAccount /></FieldContent>
                                    </ProfileContentField>
                                }



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