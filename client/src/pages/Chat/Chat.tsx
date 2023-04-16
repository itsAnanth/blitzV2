import { ChatContainer, ChatContent, ChatDiv, ChatHeader, ChatMain, ChatMainContent, ChatMainForm, ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageMeta, ChatMessageMetaWrapper, ChatSidebar, MetaAuthor, MetaTimestamp } from "./Chat.styled";

function Chat() {
    return (
        <ChatDiv>
            <ChatContainer>
                <ChatHeader />
                <ChatContent>
                    <ChatSidebar></ChatSidebar>
                    <ChatMain>
                        <ChatMainContent>
                            <ChatMessage>
                                <ChatMessageAvatar
                                    src={`https://avatars.dicebear.com/api/adventurer-neutral/0.png`}
                                />
                                <ChatMessageMetaWrapper>
                                    <ChatMessageMeta>
                                        <MetaAuthor>Author</MetaAuthor>
                                        <MetaTimestamp>{new Date(Date.now()).toDateString()}</MetaTimestamp>
                                    </ChatMessageMeta>
                                    <ChatMessageContent>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</ChatMessageContent>
                                </ChatMessageMetaWrapper>
                            </ChatMessage>

                        </ChatMainContent>
                        <ChatMainForm>
                            <form>
                                <textarea
                                    placeholder="Message"
                                    name="message"
                                    autoComplete="off"
                                />
                                <button>Send</button>
                            </form>
                        </ChatMainForm>
                    </ChatMain>
                </ChatContent>
            </ChatContainer>
        </ChatDiv>
    )
}

export default Chat;