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



    const getDisplayDate = (time: number) => {
        let today = new Date();
        let timestamp = new Date(time);

        let timeFormat;


        if (today.getDay() == timestamp.getDay()) {
            let t = timestamp.toLocaleTimeString().split(':')
            timeFormat = `Today at ${t[0]}:${t[1]} ${t[2].split(' ')[1]}`
        } else if (today.getDay() == timestamp.getDay() + 1) {
            let t = timestamp.toLocaleTimeString().split(':')
            timeFormat = `Today at ${t[0]}:${t[1]} ${t[2].split(' ')[1]}`
        } else {
            let t = timestamp.toLocaleString().split(',');
            timeFormat = t.join(' ');
        }


        return timeFormat;
    }

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
                    <MetaTimestamp>{getDisplayDate(msg.timestamp)}</MetaTimestamp>
                </ChatMessageMeta>
                <ChatMessageContent onClick={() => msg.attachemnt?.url && window.open(msg.attachemnt.url)}>{content}</ChatMessageContent>
            </ChatMessageMetaWrapper>
        </ChatMessageDiv>
    )
}

export default ChatMessage;

