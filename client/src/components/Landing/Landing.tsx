import AccountManager from "../../structures/AccountManager";
import { InputContainer, LandingContainer, LandingContent, LandingDiv, LandingHeader, LandingInput } from "./Landing.styled";

function Landing() {

    async function onSubmit(ev: any) {
        ev.preventDefault();
        let email = ev.target.email.value,
            password = ev.target.password.value,
            username = ev.target.username.value;

            
        let user = await AccountManager.signUp(username, email, password);
        console.log(user);
        
    }
    return (
        <LandingDiv>
            <LandingContainer>
                <LandingHeader></LandingHeader>
                <LandingContent
                    onSubmit={onSubmit}
                    autoComplete="off"
                >
                    <InputContainer>
                        <h3>Username</h3>
                        <LandingInput
                            type="text"
                            name="username"
                            id="username"
                            placeholder="What should everyone call you"
                            required
                        />
                    </InputContainer>
                    <InputContainer>
                        <h3>Email</h3>
                        <LandingInput
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            required
                        />
                    </InputContainer>
                    <InputContainer>
                        <h3>Username</h3>
                        <LandingInput
                            type="password"
                            name="password"
                            id="password"
                            placeholder="password"
                            required
                        />
                    </InputContainer>
                    <InputContainer>
                        <button type="submit">sign up</button>
                    </InputContainer>
                </LandingContent>
            </LandingContainer>
        </LandingDiv>
    )
}

export default Landing;