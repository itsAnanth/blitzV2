import styled from "styled-components";

export const LandingDiv = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.bg};
`;

export const LandingContainer = styled.div`
    width: 50%;
    /* height: 70%; */
    display: flex;
    align-items: flex-start;
    align-content: flex-start;
    justify-content: flex-start;
    flex-direction: column;

    @media (max-width: 800px) {
        width: 100%;
        height: 100%;
    }
`;

export const LandingHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.text};
    font-size: 2rem;
    font-weight: 500;
    width: 100%;
    max-height: 100px;
    /* flex: 25%; */
    height: 80px;
    background-color: ${({ theme }) => theme.primary};
`;

export const LandingContent = styled.form`
    background-color: ${({ theme }) => theme.tertiary};
    flex: 75%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const LandingInput = styled.input`
    /* background-color: pink; */
    border: none;
    width: 80%;
    outline: none;
    border-radius: 10px;
    height: 2.5rem;
    line-height: 30px;
    padding: 0 1rem;
    color: ${({ theme }) => theme.primary};
    font-weight: 500;


`;

export const LandingHeading = styled.div`
    margin: 1rem;
    color: ${({ theme }) => theme.lightText};
`

export const InputContainer = styled.div`

    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

export const SubmitButton = styled.button`
    outline: none;
    border: none;
    width: 5rem;
    height: 2rem;
    border-radius: 30px;
    margin: 1rem 1rem;
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
`;

export const ErrorOverlay = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
    font-size: 1.2rem;
    margin: 1rem 0;
`;

export const LandingFooter = styled.div`
    background-color: ${({ theme }) => theme.primary};
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 50px;
    color: ${({ theme }) => theme.lightText};
    font-weight: 400;

    @media (max-width: 800px) {
        font-size: 0.7rem;
        padding-left: 1rem;
    }

`


export const SignInProviders = styled.div`
    display: flex;
    height: 100%;
    color: ${({ theme }) => theme.lightText};
    margin-right: 4rem;
    font-size: 1.3rem;


    & > * {
        :hover {
            cursor: pointer;
            transform: scale(1.3);
        }
        transition: all 500ms ease;

    }
`

export const CheckBoxContainer = styled.div`

    /* width: 100%; */
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: row;
    width: 100%;
    padding-bottom: 1rem;



`; 
export const CheckBoxLabel = styled.label`
    color: ${({ theme }) => theme.text};
    padding-left: 10%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 50%;
    flex-grow: 1;
    flex-direction: row;
`
export const CheckBox = styled(LandingInput)`
    transform: scale(0.5);
    width: 10%;
    max-width: 45px;
    border: none;
`
