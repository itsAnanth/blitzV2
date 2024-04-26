import styled, { keyframes } from "styled-components";

export const ChatDiv = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
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
    color: ${({ theme }) => theme.text};
    
`;

export const ChatContent = styled.div`
    flex: 75%;
    width: 100%;
    display: flex;
    overflow: hidden;
    /* background-color: lightgreen; */

`;

export const ChatSidebar = styled.div<{ width?: number }>`
    /* flex: 20%; */
    /* max-width: 20%; */
    width: ${({ width = 15 }) => width}%;
    background-color: ${({ theme }) => theme.tertiary};
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    scrollbar-gutter: stable;

    ::-webkit-scrollbar {
        /* display: none; */
    }

    :hover {
        ::-webkit-scrollbar {
            display: block;
        }
    }

    @media (max-width: 800px) {
        display: none;
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
    max-width: 100%;
    height: 100%;
    flex: 80%;
    overflow-y: scroll;
    padding: 0 0.8rem;
`;

export const ChatMessage = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
    user-select: none;
    flex-direction: row;
    align-items: flex-start;
    padding-top: 0.5rem;
    margin: 0.5rem 0;

    transition: background-color 0.3;

    :hover {
        background-color: ${({ theme }) => theme.tertiary};
        border-radius: 10px;

    }
`;

export const ChatMessageAvatar = styled.img`
    width: 40px;
    height: 40px;
    margin: 0.7rem 1rem;
    object-fit: cover;
    margin-right: 1rem;
    border-radius: 50%;
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
    padding: 0.2rem 0;
    display: flex;
    align-items: center;
`;

export const MetaAuthor = styled.div`
    max-width: 50%;
    font-size: 1rem;
    margin-right: 1rem;
    font-weight: 450;
    color: ${({ theme }) => theme.text};
    
`

export const MetaTimestamp = styled.div`
    font-size: 0.7rem;
    line-height: 1rem;
    max-width: 20%;
    color: ${({ theme }) => theme.lightText};

`

export const ChatMessageContent = styled.div`
    /* background-color: blue; */
    color: ${({ theme }) => theme.text};
    font-size: 0.9rem;
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
        height: 80%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 95%;
    }
    input {
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
    height: 70%;
    font-size: 2rem;
    color: ${({ theme }) => theme.text};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ChatMainFormUploadBtn = styled.div`
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
`


export const ChannelsContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin: 5px 0;

`

export const ChannelDiv = styled.div<{ active?: boolean }>`
    /* margin: 1rem 1rem 0 0.5rem; */
    /* margin: 1rem 1rem 0 0.5rem; */

    max-height: 70px;
    min-height: 70px;
    display: flex;
    color: white;
    justify-content: center;
    align-items: center;
    width: calc(100% - 5px);
    height: 100%;
    align-items: center;
    padding: 1rem 1rem;
    background-color: ${({ active, theme }) => active && theme.lightbg};
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: break-word;
    text-align: center;

    &:hover {
        cursor: pointer;
        background-color: ${({ theme }) => theme.lightbg};
    }
`;

export const UsersContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin: 5px 0;

`

export const User = styled.div`
    margin: 1rem 1rem 0 0.5rem;
    max-height: 70px;
    display: flex;
    width: 95%;
    height: 100%;
    align-items: center;
    padding: 1rem 1rem;

    :hover {
        background-color: ${({ theme }) => theme.lightbg};
        cursor: pointer;
    }
`;

export const UserAvatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

export const UserDetail = styled.div`
    display: flex;
    align-items: center;
    padding-left: 1rem;
    color: ${({ theme }) => theme.text};
    font-size: 0.9rem;
    font-weight: 400;
    height: 100%;
    width: 100%;
`;

export const LogoutDiv = styled.div`

    color: ${({ theme }) => theme.text};
    font-size: 2rem;
    padding-right: 2rem;

    :hover {
        transform: scale(1.2);
        cursor: pointer;
    }
`

export const ChatHeaderLeft = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const LinkDiv = styled.div`

    color: ${({ theme }) => theme.text};
    font-size: 2rem;
    padding-right: 2rem;
    font-weight: 100;

    :hover {
        transform: scale(1.2);
        cursor: pointer;
    }
`

export const NoChat = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: ${({ theme }) => theme.bg};

    /* background-color: red; */
`;

export const NoChatKeyframe = keyframes`
    90% {
        transform: rotate(350deg);
    }
`

export const NoChatIcon = styled.div`
    font-size: 10rem;
    color: ${({ theme }) => theme.lightText};
    transition: all 1s ease;

    &:hover {
        transform: scale(1.5);
    }

`;

export const NoChatContent = styled.div`
    color: ${({ theme }) => theme.lightText};
    font-weight: 400;
    font-size: 1.3rem;
    
`
