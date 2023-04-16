export namespace DataTypes {
    export namespace Server {
        export type CONNECT = [{ success: boolean, username?: string }];




    }

    export namespace Client {
        export type CONNECT = [{ username: string }];
    }
}