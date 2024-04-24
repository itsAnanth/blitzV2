import { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../contexts/firebase.context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BackspaceIcon, FieldContent, FieldHeading, NoUserFound, ProfileContainer, ProfileContent, ProfileContentField, ProfileContentFieldContainer, ProfileContentImage, ProfileHeader } from "./Profile.styled";
import { LoaderContext } from "../../contexts/loader.context";
import { DbUser, usersDb } from "../../../../database";
import { IoArrowBack } from "react-icons/io5";


function Profile() {

    const authContext = useContext(FireBaseContext);
    const navigate = useNavigate();
    const loaderContext = useContext(LoaderContext);
    const [searchParams, setSearchParams] = useSearchParams()
    const [user, setUser] = useState<DbUser>();
    const idParam = searchParams.get('id');


    useEffect(() => {
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
        if (loaderContext)
            loaderContext.setLoader(false);
    }, [user])

    return (
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
                        <ProfileContentImage
                            src={user?.photoURL}
                        />

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
    )
}

export default Profile;