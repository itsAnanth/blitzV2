import { useState, useEffect } from 'react';
import AccountManager from "../../structures/AccountManager";
import { ErrorOverlay, InputContainer, LandingContainer, LandingContent, LandingDiv, LandingFooter, LandingHeader, LandingHeading, LandingInput, SubmitButton } from "./Landing.styled";
import { useNavigate, Link } from 'react-router-dom';
import { LandingTypes } from '../../utils/LandingTypes';
import { getAuth } from 'firebase/auth';
function Landing({ type }: any) {

    const auth = getAuth();
    const [error, setError] = useState();
    const navigate = useNavigate();
    async function onSubmit(ev: any) {
        ev.preventDefault();
        let email = ev.target.email.value,
            password = ev.target.password.value;
        let user;

        if (type === LandingTypes.SIGNUP) {
            let username = ev.target.username.value;
            user = await AccountManager.signUp(username, email, password);
        } else {
            user = await AccountManager.signIn(email, password);
        }

        if (user.error) return setError(user.detail.split("/")[1].split("-").join(" "));

        navigate('/chat');

    }

    useEffect(() => {
        console.log(auth.currentUser)
        if (auth.currentUser) navigate('/chat')
    })
    return (
        <>
            {auth.currentUser ? <></> :
                <LandingDiv>
                    <LandingContainer>
                        <LandingHeader>Blitz App</LandingHeader>
                        <LandingContent
                            onSubmit={onSubmit}
                            autoComplete="off"
                        >
                            <ErrorOverlay>{error}</ErrorOverlay>
                            {type === LandingTypes.SIGNUP &&

                                <InputContainer>
                                    <LandingHeading>Username</LandingHeading>
                                    <LandingInput
                                        type="text"
                                        name="username"
                                        id="username"
                                        placeholder={type === LandingTypes.SIGNUP ? 'What should everyone call you' : 'Username'}
                                        autoComplete='true'
                                        required
                                    />
                                </InputContainer>}
                            <InputContainer>
                                <LandingHeading>Email</LandingHeading>

                                <LandingInput
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    autoComplete='true'
                                    required
                                />
                            </InputContainer>
                            <InputContainer>
                                <LandingHeading>Password</LandingHeading>

                                <LandingInput
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete='true'
                                    placeholder="password"
                                    required
                                />
                            </InputContainer>
                            <InputContainer>
                                <SubmitButton type="submit">{type === LandingTypes.SIGNUP ? 'Sign Up' : 'Sign In'}</SubmitButton>
                            </InputContainer>
                        </LandingContent>
                        <LandingFooter>{type === LandingTypes.SIGNUP ?
                            <>
                                Have an account? <Link style={{ paddingLeft: '10px' }} to='/signin'>Sign In</Link>
                            </> :
                            <>
                                Haven't made an account yet? <Link style={{ paddingLeft: '10px' }} to='/signup'><i />Sign Up</Link>
                            </>}</LandingFooter>
                    </LandingContainer>
                </LandingDiv>
            }
        </>
    )
}

export default Landing;