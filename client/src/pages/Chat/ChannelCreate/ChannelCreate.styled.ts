import { IoCloseOutline } from "react-icons/io5"
import styled from "styled-components"

export const ChannelDialogContainer = styled.div<{ show: boolean }>`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    z-index: 99;

    display: ${({ show }) => show ? 'flex' : 'none'};

    align-items: center;
    justify-content: center;
    background-color: rgba(32, 34, 37, 0.8);

    /* background-color: rgba(32, 34, 37, 0.6); */





`


export const ChannelDialog = styled.div<{ show: boolean }>`
    
    border: 1px solid ${({ theme }) => theme.text};
    display: ${({ show }) => show ? 'flex' : 'none'};

    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    z-index: 99;
    background-color: blue;

    height: 80%;
    width: 40%;
`

export const ChannelDialogHeading = styled.div`
    display: flex;
    width: 100%;
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text};

    height: 20%;
    justify-content: space-around;
    align-items: center;
`

export const ChannelDialogContent = styled.div`
    background-color: green;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 80%;
`

export const CloseBtn = styled(IoCloseOutline)`
    color: ${({ theme }) => theme.text};
    font-size: 1.3rem;
    
    :hover {
        cursor: pointer;
    }
`

export const Form = styled.form`
    padding: 2rem 0;
    background-color: ${({ theme }) => theme.tertiary};
    flex: 75%;
    height: 80%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;

export const Input = styled.input`
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

export const SubmitButton = styled.button`
    outline: none;
    border: none;
    width: 5rem;
    height: 2rem;
    border-radius: 30px;
    margin: 1rem 1rem;
    color: ${({ theme }) => theme.primary};
    font-weight: 500;

    :hover {
        cursor: pointer;
    }
`;


export const InputHeading = styled.div`
    margin: 1rem;
    color: ${({ theme }) => theme.lightText};
`

export const InputContainer = styled.div<{ justify?: string }>`

    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: ${({ justify }) => justify ?? 'center'};
`;
