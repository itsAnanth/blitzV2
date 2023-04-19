import Channel from "../../server/src/structures/Channel/Channel";

export namespace DataTypes {
    export namespace Server {
        export type CONNECT = [{ success: boolean, username?: string }];
        export type MESSAGE_CREATE = [{ content: string, recipient: string, authorId: string, messageId: string, authorUsername: string }];
        export type GET_CHANNELS = ReturnType<Channel['serialize']>[];


    }

    export namespace Client {
        export type USER_JOIN = [{ username: string, userId: string, avatar: number }];
        export type CONNECT = [{ username: string }];
        export type JOIN_CHANNEL = [{ channelId: string }];
        export type MESSAGE_CREATE = [{ content: string, recipient: string }];
        export type CREATE_CHANNEL = [{ channelName: string }];
    }
}