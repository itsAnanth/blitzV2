import { JsonWebKey } from "crypto";
abstract class User {
    id: string;
    username: string;
    avatar: number;
    publicKeyJwk: JsonWebKey;
    abstract serialize(): { username: string, avatar: number, id: string };
}

export default User;