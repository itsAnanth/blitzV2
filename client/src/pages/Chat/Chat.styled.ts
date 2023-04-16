import styled from "styled-components";

export const ChatDiv = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ChatContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    background-color: ${({ theme }) => theme.primary};
`;

export const ChatHeader = styled.div`
    display: flex;
    width: 100%;
    flex: 25%;
    max-height: 80px;
    background-color: ${({ theme }) => theme.secondary};
`;

export const ChatContent = styled.div`
    flex: 75%;
    width: 100%;
    display: flex;
    background-color: lightgreen;

`;

export const ChatSidebar = styled.div`
    flex: 20%;
    background-color: lightblue;
`

export const ChatMain = styled.div`
    flex: 80%;
    background-color: lightpink;
    display: flex;
    flex-direction: column;
`;

export const ChatMainContent = styled.div`
    position: relative;
    background-color: ${({ theme }) => theme.primary};
    width: 100%;
    height: 100%;
    flex: 80%;
    overflow-y: scroll;
`;

export const ChatMessage = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
    user-select: none;
    /* background-color: green; */
    flex-direction: row;
    align-items: flex-start;

    transition: background-color 0.3;

    :hover {
        background-color: ${({ theme }) => theme.secondary50};

    }
`;

export const ChatMessageAvatar = styled.img`
    width: 3rem;
    height: 3rem;
    margin: 0.7rem 1rem;
    object-fit: cover;
    margin-right: 1rem;
    border-radius: 50%;
    background-color: red;
`;

export const ChatMessageMetaWrapper = styled.div`
    overflow-x: hidden;
    width: 100%;
    /* background-color: yellow; */
    height: 100%;
    display: flex;
    margin-left: 1rem;
    flex-direction: column;
`;

export const ChatMessageMeta = styled.div`
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
`;

export const MetaAuthor = styled.div`
    max-width: 50%;
    font-size: 1rem;
    margin-right: 1rem;
`

export const MetaTimestamp = styled.div`
    font-size: 0.7rem;
    line-height: 1rem;
    max-width: 20%;
`

export const ChatMessageContent = styled.div`
    /* background-color: blue; */
    color: ${({ theme }) => theme.secondary};
    padding: 1rem 0;
    padding-right: 1rem;
    word-break: break-word;
    white-space: pre-line;
    overflow-wrap: break-word;
    -ms-word-break: break-word;
    word-break: break-word;
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;  
    max-width: 100%;
`;

export const ChatMainForm = styled.div`
    position: relative;
    bottom: 0;
    width: 100%;
    max-height: 70px;
    background-color: aliceblue;
    flex: 20%;

    form {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    textarea {
        resize: none;
        border: none;
        height: 80%;
        flex: 70%;
        outline: none;
        word-break: break-word;
                white-space: pre-line;
                overflow-wrap: break-word;
                -ms-word-break: break-word;
                word-break: break-word;
                -ms-hyphens: auto;
                -moz-hyphens: auto;
                -webkit-hyphens: auto;
                hyphens: auto;
    }
`;
