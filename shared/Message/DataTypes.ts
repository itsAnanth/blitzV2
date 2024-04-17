import Channel from "../../server/src/structures/Channel/Channel";
import ChatMessage from "../ChatMessage/ChatMessage";
import User from "../User/User";
import ChannelType from "../Channel/Channel";

export namespace DataTypes {

    export namespace Server {
        export type HANDSHAKE = []
        export type CREATE_CHANNEL = [ChannelType];
    
        export type CONNECT = [{ success: boolean, username?: string }];
        export type MESSAGE_CREATE = [ChatMessage]
        // export type MESSAGE_CREATE = [{ content: string, recipient: string, author: string, messageId: string, authorUsername: string, timestamp: number, avatar: number }];
        export type GET_CHANNELS = ReturnType<Channel['serialize']>[];
        export type JOIN_CHANNEL = ReturnType<User['serialize']>[];
        export type SET_ACTIVE_CHANNEL = [{ channelId: string }];

    }

    export namespace Client {
        export type HANDSHAKE = [{ userId: string }];
        export type USER_JOIN = [{ username: string, userId: string, avatar: number }];
        export type CONNECT = [{ username: string }];
        export type JOIN_CHANNEL = [{ channelId: string }];
        export type MESSAGE_CREATE = [{ content: string, recipient: string, author: string }];
        export type CREATE_CHANNEL = [{ channelName: string, owner: string }];
        export type SET_ACTIVE_CHANNEL = [{ channelId: string }];
    }
}