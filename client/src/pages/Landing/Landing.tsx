import { useState, useEffect, useContext } from 'react';
import AccountManager from "../../structures/AccountManager";
import { CheckBox, CheckBoxContainer, CheckBoxLabel, ErrorOverlay, InputContainer, LandingContainer, LandingContent, LandingDiv, LandingFooter, LandingHeader, LandingHeading, LandingInput, SubmitButton } from "./Landing.styled";
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { LandingTypes } from '../../utils/LandingTypes';
import { FireBaseContext } from '../../contexts/firebase.context';
import { LoaderContext } from '../../contexts/loader.context';
import { getPersistence, setPersistence } from '../../utils';
import { PersistenceType } from '../../utils/setPersistence';
import Db from '../../structures/Db';
function Landing({ type }: any) {

    const loaderContext = useContext(LoaderContext);
    const authContext = useContext(FireBaseContext);
    const [error, setError] = useState<string | null>(null);
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




        setPersistence(ev.target.checkbox.checked ? PersistenceType.REMEMBER_USER : PersistenceType.FORGET_USER);

    }

    useEffect(() => {
        setError(null);
    }, [type])

    useEffect(() => {
        loaderContext.setLoader(false);
    }, [])

    useEffect(() => {
        console.log(authContext.user, 'landing state changed');

        if (authContext.user) {
            // loaderContext.setLoader(true);
            // loaderContext.setLoaderText("Creating User Data...");
    
            Db.setUser(authContext.user);
            navigate('/chat')
        }
        // if (authContext.user) navigate('/chat')
    }, [authContext.user])

    return (
        <>
            {authContext.user ? <Navigate to={'/chat'} /> :
                <LandingDiv>
                    <LandingContainer>
                        <LandingHeader>Blitz App</LandingHeader>
                        <LandingContent
                            onSubmit={onSubmit}
                            autoComplete="off"
                        >
                            {error && <ErrorOverlay>{error}</ErrorOverlay>}
                            {type === LandingTypes.SIGNUP &&

                                <InputContainer>
                                    <LandingHeading>Username</LandingHeading>
                                    <LandingInput
                                        type="text"
                                        name="username"
                                        id="username"
                                        placeholder={type === LandingTypes.SIGNUP ? 'What should everyone call you' : 'Username'}
                                        autoComplete='off'
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
                                    autoComplete='off'
                                    autoCapitalize='none'
                                    autoCorrect='off'
                                    maxLength={999}
                                    required
                                />
                            </InputContainer>
                            <InputContainer>
                                <LandingHeading>Password</LandingHeading>

                                <LandingInput
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete='on'
                                    placeholder="password"
                                    required
                                />
                            </InputContainer>

                            <InputContainer>
                                <SubmitButton type="submit">{type === LandingTypes.SIGNUP ? 'Sign Up' : 'Sign In'}</SubmitButton>
                            </InputContainer>

                            <CheckBoxContainer>
                                <CheckBoxLabel>
                                    Remember Me
                                    <CheckBox
                                        style={{ transform: "scale(0.5)", width: "10%" }}
                                        type="checkbox"
                                        value={"checkbox"}
                                        name='checkbox'
                                        defaultChecked={getPersistence() === PersistenceType.REMEMBER_USER ? true : false}
                                        // checked={getPersistence()}
                                    />
                                </CheckBoxLabel>



                            </CheckBoxContainer>
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