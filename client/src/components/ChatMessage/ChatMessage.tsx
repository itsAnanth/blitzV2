import { DbMessage, DbUser } from "../../../../database";
import { ChatMessage as ChatMessageDiv, ChatMessageMetaWrapper, ChatMessageAvatar, MetaAuthor, MetaTimestamp, ChatMessageContent, ChatMessageMeta, MediaPreviewAudio, MediaPreviewVideo } from "../../pages/Chat/Chat.styled"
import { Logger, fileType } from "../../utils";
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

    
    if (!msg.attachemnt || msg.attachemnt.type === null || msg.attachemnt.type === 'text')
        content = msg.content
    else if (fileType(msg.attachemnt.type) === 'image') 
        content = <ChatMessageImage src={msg.attachemnt.url}/>

    else if (fileType(msg.attachemnt.type) === 'audio')
        content = <MediaPreviewAudio controls={true} src={msg.attachemnt.url} />
    else if (fileType(msg.attachemnt.type) === 'video')
        content = <MediaPreviewVideo controls={true} width="320" height="240" src={msg.attachemnt.url} />


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