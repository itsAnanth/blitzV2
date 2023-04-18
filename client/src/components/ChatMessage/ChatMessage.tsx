import { ChatMessage as ChatMessageDiv, ChatMessageMetaWrapper, ChatMessageAvatar, MetaAuthor, MetaTimestamp, ChatMessageContent, ChatMessageMeta } from "../../pages/Chat/Chat.styled"

function ChatMessage({ author, content, timestamp }: {
    author: string, content: string, timestamp: string
}) {
    return (

        <ChatMessageDiv>
            <ChatMessageAvatar
                src={`https://avatars.dicebear.com/api/adventurer-neutral/0.png`}
            />
            <ChatMessageMetaWrapper>
                <ChatMessageMeta>
                    <MetaAuthor>{author}</MetaAuthor>
                    <MetaTimestamp>{timestamp}</MetaTimestamp>
                </ChatMessageMeta>
                <ChatMessageContent>{content}</ChatMessageContent>
            </ChatMessageMetaWrapper>
        </ChatMessageDiv>
    )
}

export default ChatMessage;