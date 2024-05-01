import { DbMessage, DbUser } from "../../../../database";
import { ChatMessage as ChatMessageDiv, ChatMessageMetaWrapper, ChatMessageAvatar, MetaAuthor, MetaTimestamp, ChatMessageContent, ChatMessageMeta } from "../../pages/Chat/Chat.styled"
import { Logger } from "../../utils";
import { ChatMessageImage } from "./ChatMessage.styled";

function ChatMessage({ msg, user }: { msg: DbMessage, user: DbUser }) {

    let content;
    user = user ?? {
        username: 'bot',
        userId: '0',
        photoURL: 0,
        channels: [],
        timestamp: Date.now()
    }

    if (msg.attachemnt && msg.attachemnt.type.includes('image')) {
        content = <ChatMessageImage src={msg.attachemnt.url}/>
    } else {
        content = msg.content
    }

    // Logger.logc('blue', 'TEST', user as any)

    // console.log(msg)
    return (

        <ChatMessageDiv>
            <ChatMessageAvatar
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                src={typeof user?.photoURL === 'number' ? `https://api.dicebear.com/7.x/pixel-art/svg?seed=${0}` : user.photoURL}
            />
            <ChatMessageMetaWrapper>
                <ChatMessageMeta>
                    <MetaAuthor>{user.username}</MetaAuthor>
                    <MetaTimestamp>{msg.timestamp}</MetaTimestamp>
                </ChatMessageMeta>
                <ChatMessageContent>{content}</ChatMessageContent>
            </ChatMessageMetaWrapper>
        </ChatMessageDiv>
    )
}

export default ChatMessage;