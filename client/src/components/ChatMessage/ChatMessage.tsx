import { ChatMessage as ChatMessageDiv, ChatMessageMetaWrapper, ChatMessageAvatar, MetaAuthor, MetaTimestamp, ChatMessageContent, ChatMessageMeta } from "../../pages/Chat/Chat.styled"

function ChatMessage({ author, content, timestamp, avatar }: {
    author: string, content: string, timestamp: string, avatar: number|string
}) {
    return (

        <ChatMessageDiv>
            <ChatMessageAvatar
                src={typeof avatar === 'number' ? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatar}` : avatar}
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