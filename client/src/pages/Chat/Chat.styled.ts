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
    align-items: center;
    flex-direction: row;
    background-color: ${({ theme }) => theme.primary};
`;

export const ChatHeaderBrand = styled.div`
    flex: 20%;
    display: flex;
    align-items: center;
    padding-left: 40px;
    font-weight: 600;
    font-size: 1.3rem;
    color: ${({ theme }) => theme.bg};
`;

export const ChatContent = styled.div`
    flex: 75%;
    width: 100%;
    display: flex;
    overflow: hidden;
    /* background-color: lightgreen; */

`;

export const ChatSidebar = styled.div`
    flex: 20%;
    background-color: ${({ theme }) => theme.tertiary};
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    scrollbar-gutter: stable both-edges;

    ::-webkit-scrollbar {
        display: none;
    }

    :hover {
        ::-webkit-scrollbar {
            display: block;
        }
    }

`;

export const ChatSidebarContent = styled.div`
    display: flex;
    width: 95%;
    justify-content: center;
    align-items: center;
    /* width: 80%; */
    height: 100%;

    :hover {
        background-color: ${({ theme }) => theme.secondary};
    }
`

export const ChatSidebarContainer = styled.div`
    /* background-color: red; */
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0;

  

    .active {
        background-color: ${({ theme }) => theme.primary};
    }
`

export const ChatMain = styled.div`
    flex: 80%;
    display: flex;
    flex-direction: column;
`;

export const ChatMainContent = styled.div`
    position: relative;
    background-color: ${({ theme }) => theme.bg};
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
    flex-direction: row;
    align-items: flex-start;

    transition: background-color 0.3;

    :hover {
        background-color: ${({ theme }) => theme.tertiary50};

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
    font-weight: 500;
`

export const MetaTimestamp = styled.div`
    font-size: 0.7rem;
    line-height: 1rem;
    max-width: 20%;
`

export const ChatMessageContent = styled.div`
    /* background-color: blue; */
    color: ${({ theme }) => theme.text};
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
    /* position: relative; */
    display: flex;
    justify-content: center;
    align-items: center;
    /* bottom: 0; */
    width: 100%;
    max-height: 50%;
    min-height: 70px;
    background-color: ${({ theme }) => theme.secondary};
    /* flex: 20%; */

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
        height: 50%;
        width: 90%;
        outline: none;
        border-radius: 10px;
        line-height: 35px;
        padding: 0 1rem;

    }
`;

export const ChatMainFormSend = styled.button`
    outline: none;
    border: none;
    background-color: transparent;
    height: 100%;
    font-size: 2rem;
    color: ${({ theme }) => theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const UsersContainer = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0;

`

export const User = styled.div`
    display: flex;
    width: 95%;
    height: 100%;
`;

export const UserAvatar = styled.img`
    max-width: 30px;
    width: auto;
    height: auto;
    border-radius: 50%;
`